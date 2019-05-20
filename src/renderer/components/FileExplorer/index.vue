<template>
    <div style="padding:10px;">
        <div class="search">
            <el-input v-model="text" placeholder="搜索" prefix-icon="el-icon-search"></el-input>
        </div>
        <div v-for="doc in docs" class="item" @dblclick="openDoc(doc)">
            <div>
                <div style="font-size:20px">{{ doc.title }}
                    <i class="el-icon-edit"
                       v-show="$store.state.Editor.current&&$store.state.Editor.current._id===doc._id"></i>
                </div>
                <div>
                    <time class="time" style="font-size: 12px;">{{ doc.statusTime | dateFormat }}</time>
                    <i class="el-icon-delete" style="float:right;color: #f56c6c;cursor: pointer"
                       @click="delDoc(doc._id)"></i>
                </div>
            </div>
        </div>
        <div class="footer">
            <el-button icon="el-icon-plus" type="primary" round @click="addDoc">新增文档</el-button>
        </div>
    </div>
</template>
<script>
  import draggable from 'vuedraggable'
  import dbDoc from '../../lib/dbDoc'

  export default {
    components: {
      draggable
    },
    data () {
      return {
        text: ''
      }
    },
    computed: {
      docs: {
        get () {
          if (this.text !== '') {
            return this.$store.state.Editor.docs.filter((value, index, arr) => {
              console.log(value.title.indexOf(this.text) >= 0)
              return value.title.indexOf(this.text) >= 0
            })
          } else {
            return this.$store.state.Editor.docs
          }
        }
      }
    },
    mounted () {
      this.$store.dispatch('refreshDocs')
    },
    methods: {
      test () {
        this.$store.dispatch('refreshDocs')
        console.log(this.$store.state.Editor.docs)
      },
      openDoc (doc) {
        this.$store.dispatch('openDoc', doc)
      },
      addDoc () {
        this.$store.commit('SET_CURRENT', null)
      },
      delDoc (id) {
        let that = this
        this.$confirm('此操作将永久删除该文档, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          dbDoc.delDoc(id, (err, num) => {
            if (err) {
              console.log(err)
            } else {
              dbDoc.getFirstDoc((err, doc) => {
                if (err) {
                  console.log(err)
                } else {
                  that.$store.commit('SET_CURRENT', doc)
                }
              })
              that.$store.dispatch('refreshDocs')
              that.$message({
                message: '删除成功',
                type: 'success'
              })
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>

<style scoped>
    .search {
        position: relative;
        top: 0;
    }

    .item {
        padding: 10px;
        border-bottom: 1px solid #eee;
        user-select: none;
    }

    .item:hover {
        background: #ecf5ff;
    }

    .footer {
        width: 300px;
        text-align: center;
        position: absolute;
        bottom: 20px;
        margin: auto;
    }
</style>