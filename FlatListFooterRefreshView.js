import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { CZFlatListViewPullStatus, CZFlatListViewFooterViewStatus } from "./enum";

export default class FlatListFooterRefreshView extends Component{

    /************************** 生命周期 **************************/
    constructor(props) {
        super(props);
        this.initializeParams();
        this.resetStatus();
    }

    componentDidMount() {
        if (this.props.evaluateView) this.props.evaluateView(this);
    }
    /************************** 继承方法 **************************/
    /************************** 通知 **************************/
    /************************** 创建视图 **************************/
    /************************** 网络请求 **************************/
    /************************** 自定义方法 **************************/
    /*
    * 初始化参数
    * */
    initializeParams() {
        this.pullStatus = CZFlatListViewFooterViewStatus.Initialization;
        //记录滚动前的状态，以便结束滚动后回复状态
        this.originStatus = CZFlatListViewFooterViewStatus.Initialization;
        this.state = {
            height: 0,
            resultStatus: this.pullStatus,
            show: false,
            type: 1
        }
    }
    /************************** 子组件回调方法 **************************/
    /************************** 外部调用方法 **************************/
    /*
    * 重置组件状态
    * */
    resetStatus = () => {
        //初始化状态
        if (this.pullStatus != CZFlatListViewFooterViewStatus.LoadingData) {
            this.pullStatus = CZFlatListViewFooterViewStatus.Initialization;
            const { resultStatus } = this.state;
            this.setState({
                resultStatus: this.originStatus,
                show: true
            });
        }
    }

    /*
    * 更新偏移量Y值
    * type: 1.下拉刷新(下拉同时也要更改底部视图位置) 2.上拉加载 3.已加载全部数据的情况：上拉加载，只修改高度，不修改文本
    * offsetY: Footer高度
    * */
    updateContentOffsetY(type = 1, height, offsetY) {
        if (type == 1) {
            this.setState({
                height: height,
                show: true
            });
        } else if (type == 2 || type == 4) {
            if (this.pullStatus != CZFlatListViewFooterViewStatus.LoadingData) {
                //记录上次状态
                if (this.pullStatus != CZFlatListViewFooterViewStatus.PullGoToLoad &&  this.pullStatus != CZFlatListViewFooterViewStatus.ContinePull) {
                    this.originStatus = this.pullStatus;
                }
                if (offsetY > 36) {
                    this.pullStatus = CZFlatListViewFooterViewStatus.PullGoToLoad;
                } else {
                    this.pullStatus = CZFlatListViewFooterViewStatus.ContinePull;
                }

                this.setState({
                    height: height,
                    resultStatus: this.pullStatus,
                    show: true,
                    type: type
                });
            }
        } else if (type == 3) {
            this.pullStatus = CZFlatListViewFooterViewStatus.All;
            this.setState({
                height: height,
                resultStatus: this.pullStatus,
                show: true
            });
        }
    }

    /*
    * 获取当前状态
    * */
    getCurrentStatus = () => {
        return this.pullStatus;
    }

    /*
    * 修改显示状态
    * */
    modifyShowStatus = (status, value) => {
        if (status == CZFlatListViewFooterViewStatus.Initialization) {
            this.setState({
                height: value
            });
        } else if (status == CZFlatListViewFooterViewStatus.More || status == CZFlatListViewFooterViewStatus.All) {
            this.pullStatus = status;
            this.setState({
                resultStatus: this.pullStatus
            });
        }
    }

    /*
    * 上拉加载更多数据中
    * */
    loadData = () => {
        this.pullStatus = CZFlatListViewFooterViewStatus.LoadingData;
        this.setState({
            resultStatus: this.pullStatus
        });
    }

    /*
    * 数据加载失败
    * */
    loadFail = () => {
        //初始化状态
        this.pullStatus = CZFlatListViewFooterViewStatus.Fail;
        this.setState({
            resultStatus: this.pullStatus
        });
    }
    /************************** List相关方法 **************************/
    /************************** Render中方法 **************************/
    render() {
        const { resultStatus, show, type } = this.state;
        if (!show) return null;

        let animating = false;
        let contentText = '';
        let height = this.state.height;

        if (resultStatus == CZFlatListViewFooterViewStatus.Initialization) {
            contentText = '上拉或下拉加载数据';
        } else if (resultStatus == CZFlatListViewFooterViewStatus.ContinePull) {
            animating = true;
            contentText = '上拉加载';
        } else if (resultStatus == CZFlatListViewFooterViewStatus.PullGoToLoad) {
            animating = true;
            contentText = '松手即可加载数据...';
        } else if (resultStatus == CZFlatListViewFooterViewStatus.LoadingData) {
            animating = true;
            if (type != 4) height = 36;
            contentText = '正在加载更多数据...';
        } else if (resultStatus == CZFlatListViewFooterViewStatus.More) {
            contentText = '上拉加载更多';
        } else if (resultStatus == CZFlatListViewFooterViewStatus.All) {
            contentText = '已加载全部数据';
        } else if (resultStatus == CZFlatListViewFooterViewStatus.Fail) {
            contentText = '数据加载失败，请重试';
        }

        return (
            <View style={[styles.MainView, {height: height}]}>
                <View style={[styles.ContentView]}>
                    {
                        animating ? (
                            <ActivityIndicator></ActivityIndicator>
                        ) : null
                    }
                    <Text style={[styles.TextView]}>{contentText}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    MainView: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center'
    },

    ContentView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12
    },

    TextView: {
        marginLeft: 8,
        fontSize: 16,
        color: 'gray'
    }
})