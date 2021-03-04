import apolloService from "./apolloService";
import { GET_CHARACTERS, GET_EPISODES, GET_LOCATIONS } from "~/graphql";

class ChallengeService {
  async getAllCharactersNamesWithChar(char) {
    const firstPage = await this.getFirstPageData(GET_CHARACTERS, char);
    const {
      data: {
        characters: {
          info: { pages },
          results: firstPageResults,
        },
      },
    } = firstPage;
    const firstPageNames = firstPageResults.map(result => result.name);
    const remainingPages = await this.getRemainingData(GET_CHARACTERS, char, pages);
    const remainingPagesResults = remainingPages.map(result => result.data.characters.results);
    const remainingPagesNames = remainingPagesResults.flatMap(items => {
      return items.map(item => item.name);
    });

    return firstPageNames.concat(remainingPagesNames);
  }

  async getAllEpisodesNamesWithChar(char) {
    const firstPage = await this.getFirstPageData(GET_EPISODES, char);
    const {
      data: {
        episodes: {
          info: { pages },
          results: firstPageResults,
        },
      },
    } = firstPage;

    const firstPageNames = firstPageResults.map(result => result.name);
    const remainingPages = await this.getRemainingData(GET_EPISODES, char, pages);
    const remainingPagesResults = remainingPages.map(result => result.data.episodes.results);
    const remainingPagesNames = remainingPagesResults.flatMap(items => {
      return items.map(item => item.name);
    });

    return firstPageNames.concat(remainingPagesNames);
  }

  async getAllLocationsNamesWithChar(char) {
    const firstPage = await this.getFirstPageData(GET_LOCATIONS, char);
    const {
      data: {
        locations: {
          info: { pages },
          results: firstPageResults,
        },
      },
    } = firstPage;
    const firstPageNames = firstPageResults.map(result => result.name);
    const remainingPages = await this.getRemainingData(GET_LOCATIONS, char, pages);
    const remainingPagesResults = remainingPages.map(result => result.data.locations.results);
    const remainingPagesNames = remainingPagesResults.flatMap(items => {
      return items.map(item => item.name);
    });

    return firstPageNames.concat(remainingPagesNames);
  }

  async getFirstPageData(query, char) {
    return await apolloService.executeQuery(query, {
      page: 1,
      filter: { name: char },
    });
  }

  async getRemainingData(query, char, pages) {
    const promises = [];
    for (let page = 2; page <= pages; page++) {
      promises.push(apolloService.executeQuery(query, { page, filter: { name: char } }));
    }

    return await Promise.all(promises);
  }

  countChars(array, char) {
    const reg = new RegExp(char, "gi");
    const counts = array.map(item => {
      return item.match(reg).length;
    });
    return counts.reduce((a, b) => a + b);
  }

  async getCounters() {
    const startTime = new Date();

    const [locationNames, epidosesNames, characterNames] = await Promise.all([
      this.getAllLocationsNamesWithChar("l"),
      this.getAllEpisodesNamesWithChar("e"),
      this.getAllCharactersNamesWithChar("c"),
    ]);

    const totalCharLocations = this.countChars(locationNames, "l");
    const totalCharEpisodes = this.countChars(epidosesNames, "e");
    const totalCharCharacter = this.countChars(characterNames, "c");

    const endTime = new Date();
    const totalTime = (endTime.getTime() - startTime.getTime()) / 1000;

    return {
      counts: [
        {
          total: totalCharLocations,
          char: "l",
          table: "locations",
        },
        {
          total: totalCharEpisodes,
          char: "e",
          table: "episodes",
        },
        {
          total: totalCharCharacter,
          char: "c",
          table: "characters",
        },
      ],
      totalTime,
    };
  }
}

export default new ChallengeService();
