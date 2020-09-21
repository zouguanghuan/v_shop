<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- button按钮 -->
    <el-row>
      <el-button type="primary">添加分类</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  created() { },
  methods: {}
}
</script>

<style lang="less" scoped>

</style>
