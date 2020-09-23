<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- button按钮 -->
      <el-row>
        <div style="display: inline-block; width: 324px; margin-right: 15px;">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList" clearable></el-button>
          </el-input>
        </div>
        <el-button type="primary" @click="addDialogVisible = true">添加商品</el-button>
      </el-row>
      <!-- 添加商品对话框 -->
      <el-dialog
        title="添加商品"
        :visible.sync="addDialogVisible"
        width="50%">
        <div>
          <el-form ref="formRef" :model="addGoodsInfo" label-width="80px">
            <el-form-item label="商品名称">
              <el-input v-model="addGoodsInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-input v-model="addGoodsInfo.goods_cat"></el-input>
            </el-form-item>
            <el-form-item label="价格">
              <el-input v-model="addGoodsInfo.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="数量">
              <el-input v-model="addGoodsInfo.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="重量">
              <el-input v-model="addGoodsInfo.goods_weight"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="addGoods">确认添加</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>

      <!-- 编辑对话框 -->
      <el-dialog
        title="修改商品"
        :visible.sync="putDialogVisible"
        width="50%">
        <div>
          <el-form ref="formPutRef" :model="putGoodsInfo" label-width="80px">
            <el-form-item label="商品名称">
              <el-input v-model="putGoodsInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-input v-model="putGoodsInfo.goods_cat"></el-input>
            </el-form-item>
            <el-form-item label="价格">
              <el-input v-model="putGoodsInfo.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="数量">
              <el-input v-model="putGoodsInfo.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="重量">
              <el-input v-model="putGoodsInfo.goods_weight"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="putGoods">确认修改</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <el-table :data="goodsList" border stripe :header-cell-style="thStyleFun" :cell-style="cellStyleFun">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" style="width: 170px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormate }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="getPutId(scope.row.goods_id)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeGoods(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addGoodsInfo: {
        goods_name: '乌龟',
        goods_cat: '1,2,3',
        goods_price: '',
        goods_number: '',
        goods_weight: ''
      },
      putGoodsInfo: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: ''
      },
      goodsList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 2,
      addDialogVisible: false,
      putDialogVisible: false
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('error')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
    },
    async removeGoods(id) {
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('删除成功')
      this.getGoodsList()
    },
    async addGoods() {
      const { data: res } = await this.$http.post('goods', this.addGoodsInfo)
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('添加成功')
      this.addDialogVisible = false
      this.getGoodsList()
    },
    // 点击编辑按钮时获得id
    async getPutId(id) {
      this.putDialogVisible = true
      const { data: res } = await this.$http.get(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('编辑时获取消息失败')
      }
      this.putGoodsInfo = res.data
    },
    async putGoods() {
      console.log(this.putGoodsInfo)
      const { data: res } = await this.$http.put(`goods/${this.putGoodsInfo.goods_id}`, this.putGoodsInfo)
      if (res.meta.status !== 200) {
        return this.$message.error('失败')
      }
      this.$message.success('更新成功')
      this.putDialogVisible = false
      this.getGoodsList()
    },
    thStyleFun() {
      return 'text-align:center'
    },
    cellStyleFun() {
      return 'text-align:center'
    }
  }
}
</script>

<style lang="less" scoped>

</style>
