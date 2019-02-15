const general = (state = { loading: false, showDropdown: false }, action) => {
  switch (action.type) {
    case 'LOADING': {
      return {
        showDropdown: state.showDropdown,
        loading: action.isLoading
      };
    }

    case 'SHOW_DROPDOWN': {
      return {
        showDropdown: action.isShowDropdown,
        loading: state.loading
      };
    }

    default: {
      return state;
    }
  }
};

export default general;
