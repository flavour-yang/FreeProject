export const setLocalStore = (key, value) => {
  // let obj = JSON.parse(store)
  // for(let [k, v] of Object.entries()){
  //     localStorage.setItem()
  // }
  localStorage.setItem(key, value);
};
export const getLocalstore = key => {
  return localStorage.getItem(key);
};
