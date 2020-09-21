<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <!-- <tree-table :data="cateList" :columns="columns"></tree-table> -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cataList: [],
      total: '',
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        }
      ]
    }
  },
  created() { },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('error')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
}
</style>
