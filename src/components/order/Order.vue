<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span=8>
          <el-input placeholder="请输入内容" v-model="orderId">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_id"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormate}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="getEditInfo(scope.row.order_id)">编辑</el-button>
            <!-- <el-button type="success" size="mini" icon="el-icon-location"></el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="editDialogVisible"
        width="50%">
        <!-- 表单提交部分 -->
        <el-form :model="orderForm" ref="orderRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="订单ID" prop="order_id">
            <el-input v-model="orderForm.order_id"></el-input>
          </el-form-item>
          <el-form-item label="订单是否发货" prop="is_send">
            <el-input v-model="orderForm.is_send"></el-input>
          </el-form-item>
          <el-form-item label="订单支付" prop="order_pay">
            <el-input v-model="orderForm.order_pay"></el-input>
          </el-form-item>
          <el-form-item label="订单价格" prop="order_price">
            <el-input v-model="orderForm.order_price"></el-input>
          </el-form-item>
          <el-form-item label="支付状态" prop="pay_status">
            <el-input v-model="orderForm.pay_status"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editOrder">确认修改</el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 20]"
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
      orderForm: {
        order_id: '',
        is_send: '',
        order_pay: '',
        order_price: '',
        pay_status: ''
      },
      queryInfo: {
        query: {},
        pagenum: 1,
        pagesize: 10
      },
      // 订单信息
      orderList: [],
      total: 1,
      editDialogVisible: false,
      orderId: ''
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 页面可以展示的数据
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 换页
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    async getEditInfo(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`orders/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.orderForm = res.data
    },
    async editOrder() {
      const { data: res } = await this.$http.put(`orders/${this.orderForm.order_id}`, this.orderForm)
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('成功')
      this.editDialogVisible = false
      this.getOrderList()
    },
    async search() {
      const { data: res } = await this.$http.get(`orders/${this.orderId}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log(res.data)
      this.$message.success('搜索成功')
      this.orderList = res.data.goods
    }
  }
}
</script>

<style lang="less" scoped>

</style>
