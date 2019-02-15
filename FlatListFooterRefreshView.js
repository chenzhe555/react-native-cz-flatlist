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
        this.state = {
            height: 0,
            resultStatus: CZFlatListViewFooterViewStatus.Initialization
        }
    }
    /************************** 子组件回调方法 **************************/
    /************************** 外部调用方法 **************************/
    /*
    * 重置组件状态
    * */
    resetStatus = () => {
        //初始化状态
        this.pullStatus = CZFlatListViewPullStatus.None;
        const { resultStatus } = this.state;
        this.setState({
            resultStatus: resultStatus
        });
    }

    /*
    * 更新偏移量Y值
    * type: 1.下拉刷新(下拉同时也要更改底部视图位置) 2.上拉加载 3.已加载全部数据的情况：上拉加载，只修改高度，不修改文本
    * offsetY: Footer高度
    * */
    updateContentOffsetY(type = 1, height, offsetY) {
        this.pullStatus = CZFlatListViewPullStatus.None;
        if (type == 1) {
            this.setState({
                height: height
            });
        } else if (type == 2) {
            let status;
            if (offsetY > 40) {
                status = CZFlatListViewFooterViewStatus.PullGoToLoad;
                this.pullStatus = CZFlatListViewPullStatus.PullUp;
            } else {
                status = CZFlatListViewFooterViewStatus.ContinePull;
            }

            this.setState({
                height: height,
                resultStatus: status
            });
        } else if (type == 3) {
            this.setState({
                height: height,
                resultStatus: CZFlatListViewFooterViewStatus.All
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
            this.setState({
                resultStatus: status
            });
        }
    }

    /*
    * 上拉加载更多数据中
    * */
    loadData = () => {
        this.pullStatus = CZFlatListViewPullStatus.PullUpLoadData;
        this.setState({
            resultStatus: CZFlatListViewFooterViewStatus.LoadingData
        });
    }

    /*
    * 数据加载失败
    * */
    loadFail = () => {
        //初始化状态
        this.pullStatus = CZFlatListViewPullStatus.None;
        this.setState({
            resultStatus: CZFlatListViewFooterViewStatus.Fail
        });
    }
    /************************** List相关方法 **************************/
    /************************** Render中方法 **************************/
    render() {
        const { height, resultStatus } = this.state;

        let animating = false;
        let contentText = '';
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