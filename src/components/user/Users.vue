<template>
  <div>
    <!-- 面包屑导航专业 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="30">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            @keyup.enter.native="getUserList"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
          <!-- 添加用户的对话框 -->
          <el-dialog
            title="添加用户"
            :visible.sync="dialogVisible"
            width="50%"
            @close="addDialogClosed"
          >
            <!-- 内容主体区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 修改对话框 -->
          <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="30%">
            <!-- 内容主体区域 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
              <el-form-item label="用户名" prop="username">
                <el-input disabled v-model="editForm.username"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editUser()">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 删除用户确认 -->
          <el-dialog title="删除用户" :visible.sync="deleteDialogVisible" width="30%">
            <span>要删除这个用户吗</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="deleteDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="deleteUser()">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 分配角色对话框 -->
          <el-dialog
            title="分配角色"
            :visible.sync="setRoleDialogVisible"
            width="40%"
            @close="setRoleDialogClosed"
          >
            <div>
              <p>当前的用户：{{ userInfo.username }}</p>
              <p>当前的角色：{{ userInfo.role_name }}</p>
              <p>新的角色
                <el-select v-model="selectRoleId" placeholder="请选择">
                  <el-option
                    v-for="item1 in roleList"
                    :key="item1.id"
                    :label="item1.roleName"
                    :value="item1.id">
                  </el-option>
                </el-select>
              </p>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="setRoleDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="saveRoleInfo()">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>
      <!-- 显示用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <!-- slot-scope获取这一行的数据 -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#eee"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <div>
              <!-- 修改按钮 -->
              <el-button
                @click="showEditDialog(scope.row.id)"
                size="mini"
                type="primary"
                icon="el-icon-edit"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                @click="removeUserById(scope.row.id)"
                size="mini"
                type="danger"
                icon="el-icon-delete"
              ></el-button>
              <!-- 分配角色按钮 -->
              <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button @click="setRole(scope.row)" size="mini" type="warning" icon="el-icon-setting"></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 8, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    // 验证邮箱规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的自定义规则
    var checkPhone = (rule, value, cb) => {
      const regPhone = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
      if (regPhone.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的分页参数对象
      queryInfo: {
        // 根据条件查询
        query: '',
        // 当前的页码
        pagenum: 1,
        // 每页的数据
        pagesize: 10
      },
      userlist: [],
      total: 0,
      // 弹出添加用户对话框
      dialogVisible: false,
      // form表单绑定数据
      addForm: {
        username: '',
        password: '111',
        email: '111@qq.com',
        mobile: '18070505039'

      },
      // form表单验证规则
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3-10',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度3-10',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [{
          required: true,
          message: '请输入手机号码',
          trigger: 'blur'
        },
        {
          validator: checkPhone,
          trigger: 'blur'
        }]
      },
      // 弹出修改用户对话框
      editDialogVisible: false,
      editForm: {
        id: 0,
        username: '',
        email: '',
        mobile: ''
      },
      editFormRules: {
        email: [
          {
            required: true,
            message: '输入正确邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '输入正确手机号码',
            trigger: 'blur'
          },
          {
            validator: checkPhone,
            trigger: 'blur'
          }
        ]
      },
      // 弹出删除对话框
      deleteDialogVisible: false,
      deleteUserId: 0,
      setRoleDialogVisible: false,
      roleList: [],
      userInfo: {},
      selectRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表数据失败')
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch变化
    async userStateChanged(userinfo) {
      // 修改数据axios用put
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新失败')
      }
      this.$message.success('更新成功')
    },
    // 关闭对话框重置文本框内容
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 向数据库添加用户信息
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        // console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败' + res.meta.msg)
        }
        this.$message.success('添加成功')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm.username = res.data.username
      this.editForm.email = res.data.email
      this.editForm.mobile = res.data.mobile
      this.editForm.id = parseInt(res.data.id)
    },
    // 向数据库提交修改信息
    async editUser() {
      const { data: res } = await this.$http.put('users/' + this.editForm.id, {
        email: this.editForm.email,
        mobile: this.editForm.mobile
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.getUserList()
      this.$message.success(res.meta.msg)
    },
    showDeleteDialog(id) {
      this.deleteDialogVisible = true
      this.deleteUserId = id
    },
    // 删除用户
    async removeUserById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + parseInt(id))
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getUserList()
    },
    // 设置分配角色按钮触发事件
    async setRole(userInfo) {
      this.userInfo = userInfo
      this.setRoleDialogVisible = true
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('error')
      }
      this.roleList = res.data
    },
    async saveRoleInfo () {
      if (!this.selectRoleId) {
        return this.$message.error('没有选择角色')
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId })
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败')
      }
      this.$message.success('success')
      this.setRoleDialogVisible = false
      this.getUserList()
    },
    setRoleDialogClosed () {
      this.selectRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
</style>
