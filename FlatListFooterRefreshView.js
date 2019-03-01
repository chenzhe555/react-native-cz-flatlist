import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { CZFlatListViewFooterViewStatus } from "./enum";

export default class FlatListFooterRefreshView extends Component{

    /************************** 生命周期 **************************/
    constructor(props) {
        super(props);
        this.initializeParams();
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
            show: false,
            top: 0,
            resultStatus: CZFlatListViewFooterViewStatus.Initialization
        }
    }
    /************************** 子组件回调方法 **************************/
    /************************** 外部调用方法 **************************/
    /*
    * 更新底部视图显示状态
    * type: 1.只更新位置 2.只更新状态 3.位置和状态都更新
    * top: 距离顶部距离
    * */
    updateViewShowStatus = (show, type = 1, status = CZFlatListViewFooterViewStatus.Initialization, top = -1) => {
        this.setState({
            show: show,
            top: ((type == 1 || type == 3) && top != -1 ) ? (top < 0 ? 0 : top) : this.state.top,
            resultStatus: (type == 2 || type == 3) ? status : this.state.resultStatus
        });
    }

    /*
    * 上拉加载更多数据中
    * */
    loadData = () => {
        this.setState({
            show: true,
            resultStatus: CZFlatListViewFooterViewStatus.LoadingData
        });
    }

    /*
    * 数据加载失败
    * */
    loadFail = () => {
        this.setState({
            show: true,
            resultStatus: CZFlatListViewFooterViewStatus.Fail
        });
    }
    /************************** List相关方法 **************************/
    /************************** Render中方法 **************************/
    render() {
        const { resultStatus, show, top } = this.state;
        if (!show || resultStatus == CZFlatListViewFooterViewStatus.Initialization) return null;

        let animating = false;
        let contentText = '';

        if (resultStatus == CZFlatListViewFooterViewStatus.ContinePull) {
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
        } else if (resultStatus == CZFlatListViewFooterViewStatus.Empty) {
            contentText = '暂无数据';
        }

        return (
            <View style={[styles.MainView, {top: top, height: 30}]}>
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