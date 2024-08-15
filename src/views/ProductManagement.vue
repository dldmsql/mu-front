<template>
  <div class="content">
    <h1>상품 관리</h1>
    <button @click="openCreateModal">새 상품 생성</button>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>영문 이름</th>
        <th>한글 이름</th>
        <th>설명</th>
        <th>판매가</th>
        <th>재고 수량</th>
        <th>배송 여부</th>
        <th>판매 시작일시</th>
        <th>판매 종료일시</th>
        <th>통화</th>
        <th>활성 여부</th>
        <th>브랜드명</th>
        <th>카테고리명</th>
        <th>콘텐츠 이미지 주소</th>
        <th>액션</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in paginatedItems" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.enName }}</td>
        <td>{{ item.koName }}</td>
        <td>{{ item.description }}</td>
        <td>{{ item.price }}</td>
        <td>{{ item.stockCnt }}</td>
        <td>{{ item.deliveryYn }}</td>
        <td>{{ item.saleStartAt }}</td>
        <td>{{ item.saleEndAt }}</td>
        <td>{{ item.currencyType }}</td>
        <td>{{ item.activeYn }}</td>
        <td>{{ item.brandName }}</td>
        <td>{{ item.categoryName }}</td>
        <td><img :src="item.contentUrl" alt="Product content" width="50" /></td>
        <td>
          <button @click="openEditModal(item)">수정</button>
          <button @click="confirmDelete(item.id)">삭제</button>
        </td>
      </tr>
      </tbody>
    </table>
    <!-- 페이지네이션 컴포넌트 -->
    <Pagination
        :totalPages="totalPages"
        :currentPage="currentPage"
        @page-changed="fetchData"
    />

    <!-- 수정/생성 모달 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>{{ isEditing ? '상품 수정' : '새 상품 생성' }}</h2>
        <div>
          <label for="enName">영문 이름:</label>
          <input type="text" v-model="form.enName" />
        </div>
        <div>
          <label for="koName">한글 이름:</label>
          <input type="text" v-model="form.koName" />
        </div>
        <div>
          <label for="price">판매 금액:</label>
          <input type="text" v-model="form.price" />
        </div>
        <div>
          <label for="contentUrl">컨텐츠 URL:</label>
          <input type="text" v-model="form.contentUrl" />
        </div>
        <div>
          <label for="description">설명:</label>
          <input type="text" v-model="form.description" />
        </div>
        <div>
          <label for="stockCnt">재고 수량:</label>
          <input type="text" v-model="form.stockCnt" />
        </div>
        <div>
          <label for="deliveryYn">배송 여부:</label>
          <input type="text" v-model="form.deliveryYn" />
        </div>
        <div>
          <label for="saleStartAt">판매 시작일시 (미입력시 즉시 판매 게시):</label>
          <input type="text" v-model="form.saleStartAt" />
        </div>
        <div>
          <label for="saleEndAt">판매 종료일시 (미입력시 종료 없음):</label>
          <input type="text" v-model="form.saleEndAt" />
        </div>
        <div>
          <label for="currencyType">통화:</label>
          <input type="text" v-model="form.currencyType" />
        </div>
        <div>
          <label for="brandName">브랜드명:</label>
          <select v-model="form.brandId">
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">
              {{ brand.enName }}
            </option>
          </select>
        </div>
        <div>
          <label for="categoryName">카테고리명:</label>
          <select v-model="form.categoryId">
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="activeYn">활성 여부:</label>
          <input type="checkbox" v-model="form.activeYn" />
        </div>
        <button @click="saveItem">{{ isEditing ? '저장' : '생성' }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '../components/AppPagination.vue'
import axios from 'axios'
import { BASE_URL } from "@/constant/config";

export default {
  components: {Pagination},
  data() {
    return {
      items: [],
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      showModal: false,
      isEditing: false,
      selectedItem: null,
      form: {
        enName: '',
        koName: '',
        contentUrl: '',
        description: '',
        price: '',
        stockCnt: '',
        deliveryYn: false,
        saleStartAt: '',
        saleEndAt: '',
        currencyType: '',
        brandName: '',
        categoryName: '',
        activeYn: true,
      },
      brands: [], // 브랜드 리스트
      categories: [], // 카테고리 리스트
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage)
    },
    paginatedItems() {
      const start = 0
      const end = start + this.itemsPerPage
      return this.items.slice(start, end)
    },
  },
  methods: {
    fetchData(page = 1) {
      this.currentPage = page
      axios.get(`${BASE_URL}/api/v1/products`, {
        params: {
          page: this.currentPage,
          size: this.itemsPerPage,
        },
      }).then(response => {
        const responseData = response.data.contents;
        this.items = responseData.items || [];
        this.totalItems = responseData.total || 0;
      }).catch(error => {
        console.error('Error fetching data:', error);
        this.items = [];
        this.totalItems = 0;
      })
    },
    fetchBrands() {
      axios.get(`${BASE_URL}/api/v1/brands`, {
        params: {
          page: 1,
          size: 10,
        },
      })
          .then(response => {
            this.brands = response.data.contents.items || [];
          })
          .catch(error => {
            console.error('Error fetching brands:', error);
          });
    },
    fetchCategories() {
      axios.get(`${BASE_URL}/api/v1/categories`, {
        params: {
          page: 1,
          size: 10,
        },
      })
          .then(response => {
            this.categories = response.data.contents.items || [];
          })
          .catch(error => {
            console.error('Error fetching categories:', error);
          });
    },
    openCreateModal() {
      this.isEditing = false;
      this.form = {
        enName: '',
        koName: '',
        contentUrl: '',
        description: '',
        price: '',
        stockCnt: 0,
        deliveryYn: false,
        saleStartAt: null,
        saleEndAt: null,
        currencyType: 'KRW',
        brandId: 0,
        categoryId: 0,
        activeYn: true,
      };
      this.fetchBrands(); // 브랜드 리스트 가져오기
      this.fetchCategories(); // 카테고리 리스트 가져오기
      this.showModal = true;
    },
    openEditModal(item) {
      this.isEditing = true;
      this.form = {...item};
      this.fetchBrands(); // 브랜드 리스트 가져오기
      this.fetchCategories(); // 카테고리 리스트 가져오기
      this.showModal = true;
    },
    saveItem() {
      if (this.isEditing) {
        this.updateItem();
      } else {
        this.createItem();
      }
    },
    createItem() {
      axios.post(`${BASE_URL}/api/v1/products`, this.form)
          .then(() => {
            this.fetchData(this.currentPage);
            this.closeModal();
          })
          .catch(error => {
            console.error('Error creating item:', error);
          });
    },
    updateItem() {
      axios.put(`${BASE_URL}/api/v1/products/${this.form.id}`, this.form)
          .then(() => {
            this.fetchData(this.currentPage);
            this.closeModal();
          })
          .catch(error => {
            console.error('Error updating item:', error);
          });
    },
    confirmDelete(id) {
      if (confirm("정말 삭제하시겠습니까?")) {
        this.deleteItem(id);
      }
    },
    deleteItem(id) {
      axios.delete(`${BASE_URL}/api/v1/products/${id}`)
          .then(() => {
            this.fetchData(this.currentPage);
          })
          .catch(error => {
            console.error('Error deleting item:', error);
          });
    },
    closeModal() {
      this.showModal = false;
      this.form = {
        enName: '',
        koName: '',
        contentUrl: '',
        description: '',
        price: '',
        stockCnt: '',
        deliveryYn: false,
        saleStartAt: '',
        saleEndAt: '',
        currencyType: '',
        brandName: '',
        categoryName: '',
        activeYn: true,
      };
    }
  },
  created() {
    this.fetchData();
  },
}
</script>

<style scoped>
.content {
  margin-left: 220px;
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

thead {
  background-color: #f2f2f2;
}

th, td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f9f9f9;
  font-weight: bold;
}

td img {
  display: block;
  margin: 0 auto;
}

button {
  margin-right: 5px;
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 400px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
