const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  asinList: state => state.table.asinList,
  product: state => state.table.product,
  asin: state => state.table.asin
}
export default getters
