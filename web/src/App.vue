<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  mount() {}
}
</script>

<style lang="less">
// * {
//   box-sizing: border-box;
// }
#app {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
</style>
