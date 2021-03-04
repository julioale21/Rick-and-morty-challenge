import apolloService from "./apolloService";
import { GET_CHARACTERS, GET_EPISODES, GET_LOCATIONS } from "~/graphql";

class ChallengeService {
  async getAllCharactersNamesWithChar(char) {
    const { firstPageNames, pages } = await this.getFirstPageData(GET_CHARACTERS, char);
    const remainingPages = await this.getRemainingData(GET_CHARACTERS, char, pages);
    const remainingPagesResults = remainingPages.map(result => result.data.characters.results);
    const remainingPagesNames = remainingPagesResults.flatMap(items => {
      return items.map(item => item.name);
    });

    return firstPageNames.concat(remainingPagesNames);
  }

  async getAllEpisodesNamesWithChar(char) {
    const { firstPageNames, pages } = await this.getFirstPageData(GET_EPISODES, char);
    const remainingPages = await this.getRemainingData(GET_EPISODES, char, pages);
    const remainingPagesResults = remainingPages.map(result => result.data.episodes.results);
    const remainingPagesNames = remainingPagesResults.flatMap(items => {
      return items.map(item => item.name);
    });

    return firstPageNames.concat(remainingPagesNames);
  }

  async getAllLocationsNamesWithChar(char) {
    const { firstPageNames, pages } = await this.getFirstPageData(GET_LOCATIONS, char);
    const remainingPages = await this.getRemainingData(GET_LOCATIONS, char, pages);
    const remainingPagesResults = remainingPages.map(result => result.data.locations.results);
    const remainingPagesNames = remainingPagesResults.flatMap(items => {
      return items.map(item => item.name);
    });

    return firstPageNames.concat(remainingPagesNames);
  }

  async getFirstPageData(query, char) {
    const firstPage = await apolloService.executeQuery(query, {
      page: 1,
      filter: { name: char },
    });

    const {
      data: {
        characters: {
          info: { pages },
          results: firstPageResults,
        },
      },
    } = firstPage;

    return {
      firstPageNames: firstPageResults.map(result => result.name),
      pages,
    };
  }

  async getRemainingData(query, char, pages) {
    const promises = [];
    for (let page = 2; page <= pages; page++) {
      promises.push(apolloService.executeQuery(GET_CHARACTERS, { page, filter: { name: char } }));
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
}

export default new ChallengeService();
