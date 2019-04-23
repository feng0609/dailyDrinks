<template>
    <div id="homePage">
        <v-app id="inspire">
            <v-content>
                <v-container>
                    <v-layout row>
                        <span style="font-size: x-large;">今天是{{orderDate}}</span>
                        <v-btn @click="admin = !admin">角色變成 admin</v-btn>
                    </v-layout>
                    <v-layout row>
                        <span style="font-size: x-large;">結單時間是{{endTime}} 現在時間是 {{currentTime}}</span>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs3>
                            <v-btn large @click="openDialog()" color="info">我要買飲料</v-btn>
                            <v-btn large @click="deleteOrder()" color="info">我要刪訂單</v-btn>
                        </v-flex>
                        <v-flex xs2>
                            <v-text-field v-model="searchText" label="搜尋"></v-text-field>
                        </v-flex>
                    </v-layout>
                    ＊＊＊點擊資料兩下即可編輯訂單
                    <v-layout row>
                        <v-data-table
                                v-model="selected" :headers="headers" :items="orderList"
                                :pagination.sync="pagination" :search="searchText"
                                select-all item-key="seq" class="elevation-1">
                            <template v-slot:headers="props">
                                <tr>
                                    <th>
                                        <v-checkbox :input-value="props.all" :indeterminate="props.indeterminate"
                                                    primary hide-details @click.stop="toggleAll">
                                        </v-checkbox>
                                    </th>
                                    <th v-for="header in props.headers" :key="header.text"
                                        @click="changeSort(header.value)"
                                        :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']">
                                        <v-icon small>arrow_upward</v-icon>
                                        {{ header.text }}
                                    </th>
                                </tr>
                            </template>
                            <template v-slot:items="props">
                                <tr @dblclick="editOrder(props)">
                                    <td :active="props.selected" @click="props.selected = !props.selected">
                                        <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
                                    </td>
                                    <td>{{ props.item.seq }}</td>
                                    <td class="text-xs-right">{{ props.item.buyerName }}</td>
                                    <td class="text-xs-right">{{ props.item.product }}</td>
                                    <td class="text-xs-right">{{ props.item.ice }}</td>
                                    <td class="text-xs-right">{{ props.item.sweet }}</td>
                                    <td class="text-xs-right">{{ props.item.price }}</td>
                                    <td class="text-xs-right">{{ props.item.qnt }}</td>
                                    <td class="text-xs-right">{{ props.item.subTotal}}</td>
                                    <td class="text-xs-right">{{ props.item.remark}}</td>
                                    <td class="text-xs-right">
                                        <span v-if="props.item.isPay">已付款</span>
                                        <span v-else>未付款</span>
                                        <v-btn v-if="admin && props.item.isPay===false" color="info" small
                                               @click="props.item.isPay = !props.item.isPay">付款
                                        </v-btn>
                                    </td>
                                </tr>
                            </template>
                            <template v-slot:no-data>
                                <v-alert :value="true" icon="warning">
                                    沒有可以顯示的資料
                                </v-alert>
                            </template>
                        </v-data-table>
                    </v-layout>
                </v-container>
                <v-layout row justify-center>
                    <v-dialog v-model="dialog" persistent max-width="600px">
                        <order-info
                                :orderData="rowData" @close-dialog="closeDialog()" @save-data="addOrder"
                        ></order-info>
                    </v-dialog>
                </v-layout>
            </v-content>
        </v-app>
    </div>
</template>

<script>
    import orderInfo from './components/orderInfo.vue';
    import moment from 'moment';

    export default {
        name: 'homePage',
        components: {
            orderInfo
        },
        data: () => ({
            dialog: false,
            currentTime: null,
            orderDate: moment(new Date()).format('YYYY/MM/DD'),
            endTime: '16:00',
            dialogState: null,
            rowData: {},
            searchText: null,
            admin: false,

            pagination: {
                sortBy: 'name'
            },
            selected: [],
            headers: [
                {text: '序號', value: 'seq'},
                {text: '姓名', value: 'buyerName'},
                {text: '品名', value: 'product'},
                {text: '冰量', value: 'ice'},
                {text: '糖量', value: 'sweet'},
                {text: '單價', value: 'price'},
                {text: '數量', value: 'qnt'},
                {text: '總計', value: 'subTotal'},
                {text: '備註', value: 'remark'},
                {text: '付款狀態', value: 'isPay'},
            ],
            orderList: []
        }),
        mounted() {
            setInterval(() => {
                this.currentTime = moment(new Date()).format('HH:mm:ss');
            }, 1000);
        },
        methods: {
            openDialog() {
                // 每次新增訂單都要把資料變成null這樣才可以觸發watch
                this.rowData = null;
                this.dialog = true;
            },
            closeDialog() {
                this.dialog = false;
                this.rowData = {};
                this.selected = [];
            },
            addOrder(data) {
                //表示新增產品
                if (data.seq === 0) {
                    let orderSeq = this.orderList.length;
                    if (orderSeq === 0) {
                        data.seq = 1;
                    } else {
                        this.orderList.sort(function (a, b) {
                            return a.seq - b.seq;
                        });
                        data.seq = this.orderList[orderSeq - 1].seq + 1;
                    }
                    this.orderList.push(data);
                }
                //表示修改產品
                else {
                    let order = this.orderList.findIndex(function (element) {
                        return Number(element.seq) === Number(data.seq);
                    });
                    this.orderList.splice(order, 1, data);
                    this.orderDate = null;
                    this.orderList.sort(function (a, b) {
                        return a.seq - b.seq;
                    });
                }
                this.closeDialog();
            },
            editOrder(item) {
                this.rowData = item.item;
                this.dialog = true;
            },
            deleteOrder() {
                if (this.selected.length > 0) {
                    let question = confirm('你確定要刪除這些訂單嗎?');
                    if (question) {
                        const nameList = Object.values(this.selected).map(item => item.seq);
                        this.orderList = this.orderList.filter((item) => {
                            if (nameList.includes(item.seq) === false) {
                                return true
                            }
                        });
                    }
                }
            },
            toggleAll() {
                if (this.selected.length) this.selected = [];
                else this.selected = this.orderList.slice()
            },
            changeSort(column) {
                if (this.pagination.sortBy === column) {
                    this.pagination.descending = !this.pagination.descending
                } else {
                    this.pagination.sortBy = column;
                    this.pagination.descending = false
                }
            }
        }
    }
</script>

<style>
    #inspire {
        width: 80%;
        margin: 0 auto;
    }
</style>
