import gql from "graphql-tag";

export const GET_CHARACTERS = gql`
  query($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        pages
      }
      results {
        name
      }
    }
  }
`;
export const GET_EPISODES = gql`
  query($page: Int, $filter: FilterEpisode) {
    episodes(page: $page, filter: $filter) {
      info {
        pages
      }
      results {
        name
      }
    }
  }
`;

export const GET_LOCATIONS = gql`
  query($page: Int, $filter: FilterLocation) {
    locations(page: $page, filter: $filter) {
      info {
        pages
      }
      results {
        name
      }
    }
  }
`;
