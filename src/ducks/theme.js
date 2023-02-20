const SET_THEME = 'SET_THEME';

const initialState = {
  type: localStorage.getItem('themeState')
};

const theme = (state = initialState, { type, payload }) => {
  switch(type) {
    case SET_THEME:

      if(state.type === 'light'){
        localStorage.setItem('themeState', 'dark')
      }else{
        localStorage.setItem('themeState', 'light')
      }

      return {
        ...state,
        type: localStorage.getItem('themeState')
      }
    default: 
      return state;  
  }
}

export const setTheme = (themeType) => ({
  type: SET_THEME,
  payload: themeType
})

export default theme;