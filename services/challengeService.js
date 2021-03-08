import apolloService from "./apolloService";
import { GET_CHARACTERS, GET_EPISODES, GET_LOCATIONS, GET_ALL_EPISODES } from "~/graphql";

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

  async getAllEpisodes() {
    const firstPage = await apolloService.executeQuery(GET_ALL_EPISODES, { page: 1 });
    const promises = [];

    const pages = firstPage.data.episodes.info.pages;

    for (let i = 2; i < pages; i++) {
      promises.push(apolloService.executeQuery(GET_ALL_EPISODES, { page: 1 }));
    }

    const remainingPages = await Promise.all(promises);
    const firstPageEpisodes = firstPage.data.episodes.results.map(episode => episode);
    const remainingPagesEpisodes = remainingPages
      .map(data => data.data.episodes.results)
      .flatMap(episodes => episodes.map(episode => episode));
    return firstPageEpisodes.concat(remainingPagesEpisodes);
  }

  async getAllEpisodesLocations() {
    const startTime = new Date();

    const episodesResult = await this.getAllEpisodes();
    const episodes = episodesResult.map(item => {
      const origins = item.characters.map(character => character.origin.name);

      const existing = {};
      const originsWithoutDuplicates = [];
      origins.forEach(origin => {
        if (!existing[origin]) {
          originsWithoutDuplicates.push(origin);
          existing[origin] = true;
        }
      });

      const season = parseInt(item.episode.match(/S(.*)E/)[1]);
      const episode = parseInt(item.episode.match(/E(.*)$/)[1]);

      return {
        name: item.name,
        season,
        episode,
        origins: originsWithoutDuplicates,
      };
    });

    const endTime = new Date();
    const totalTime = (endTime.getTime() - startTime.getTime()) / 1000;

    return {
      episodes,
      totalTime,
    };
  }
}

export default new ChallengeService();
