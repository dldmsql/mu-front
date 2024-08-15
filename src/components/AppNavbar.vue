<template>
  <nav>
    <ul>
      <li><router-link to="/brands">브랜드 관리</router-link></li>
      <li><router-link to="/categories">카테고리 관리</router-link></li>
      <li><router-link to="/products">상품 관리</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'AppNavbar',
}
</script>

<style scoped>
nav {
  width: 200px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #333;
  color: white;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 20px 0;
  padding-left: 20px; /* 좌측 패딩 추가 */
}

a {
  color: white;
  text-decoration: none;
}

a.router-link-active {
  font-weight: bold;
}
</style>
