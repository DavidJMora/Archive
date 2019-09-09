import React from 'react';

export default React.createContext({
  handleAuth: () => {},
  handleDelete: () => {},
  isAuth: false,
  user: null,
});