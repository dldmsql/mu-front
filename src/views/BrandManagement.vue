<template>
  <div class="content">
    <h1>브랜드 관리</h1>
    <button @click="openCreateModal">새 브랜드 생성</button>
    <!-- 브랜드 정보를 테이블 형식으로 출력 -->
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>영문 이름</th>
        <th>한글 이름</th>
        <th>설명</th>
        <th>서브 이름</th>
        <th>아이콘 이미지</th>
        <th>액션</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in paginatedItems" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.enName }}</td>
        <td>{{ item.koName }}</td>
        <td>{{ item.description }}</td>
        <td>{{ item.subName }}</td>
        <td><img :src="item.iconImg" alt="Brand Icon" width="50" /></td>
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
        <h2>{{ isEditing ? '브랜드 수정' : '새 브랜드 생성' }}</h2>
        <div>
          <label for="enName">영문 이름:</label>
          <input type="text" v-model="form.enName" />
        </div>
        <div>
          <label for="koName">한글 이름:</label>
          <input type="text" v-model="form.koName" />
        </div>
        <div>
          <label for="subName">서브 이름:</label>
          <input type="text" v-model="form.subName" />
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
          <label for="iconImg">아이콘 이미지:</label>
          <input type="text" v-model="form.iconImg" />
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
  components: { Pagination },
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
        subName: '',
        contentUrl: '',
        description: '',
        iconImg: '',
        activeYn: true,
      },
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
      axios.get(`${BASE_URL}/api/v1/brands`, {
        params: {
          page: this.currentPage,
          size: this.itemsPerPage,
        },
      }).then(response => {
        const responseData = response.data.contents
        this.items = responseData.items || []
        this.totalItems = responseData.total || 0
      }).catch(error => {
        console.error('Error fetching data:', error)
        this.items = []
        this.totalItems = 0
      })
    },
    openCreateModal() {
      this.isEditing = false
      this.form = {
        enName: '',
        koName: '',
        subName: '',
        contentUrl: '',
        description: '',
        iconImg: '',
        activeYn: true,
      }
      this.showModal = true
    },
    openEditModal(item) {
      this.isEditing = true
      this.form = {...item}
      this.showModal = true
    },
    saveItem() {
      if (this.isEditing) {
        this.updateItem()
      } else {
        this.createItem()
      }
    },
    createItem() {
      axios.post(`${BASE_URL}/api/v1/brands`, this.form)
          .then(() => {
            this.fetchData(this.currentPage)
            this.closeModal()
          }).catch(error => {
        console.error('Error creating item:', error)
      })
    },
    updateItem() {
      axios.put(`${BASE_URL}/api/v1/brands/${this.form.id}`, this.form)
          .then(() => {
            this.fetchData(this.currentPage)
            this.closeModal()
          }).catch(error => {
        console.error('Error updating item:', error)
      })
    },
    confirmDelete(id) {
      if (confirm("정말 삭제하시겠습니까?")) {
        this.deleteItem(id)
      }
    },
    deleteItem(id) {
      axios.delete(`${BASE_URL}/api/v1/brands/${id}`)
          .then(() => {
            this.fetchData(this.currentPage)
          }).catch(error => {
        console.error('Error deleting item:', error)
      })
    },
    closeModal() {
      this.showModal = false
      this.form = {
        enName: '',
        koName: '',
        subName: '',
        contentUrl: '',
        description: '',
        iconImg: '',
        activeYn: true,
      }
    }
  },
  created() {
    this.fetchData()
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
