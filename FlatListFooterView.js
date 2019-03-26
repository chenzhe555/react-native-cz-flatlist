import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { CZFlatListViewFooterViewStatus } from "./enum";

export default class FlatListFooterView extends Component{

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
            show: true,
            status: CZFlatListViewFooterViewStatus.Initialization
        }
    }
    /************************** 子组件回调方法 **************************/
    /************************** 外部调用方法 **************************/

    /*
    * 获取偏移量
    * offsetY: 偏移量
    * originStatus: 如果是正在请求，则保持组件状态
    * */
    updateContentOffsetY = (offsetY, originStatus = -1) => {
        const { bottomLoadContentOffset } = this.props;
        let status;
        if (offsetY > bottomLoadContentOffset) {
            status = CZFlatListViewFooterViewStatus.PullGoToLoad;
        } else {
            status = CZFlatListViewFooterViewStatus.ContinePull;
        }

        let evaluateStatus = originStatus != -1 ? originStatus : status;
        if (this.state.status != evaluateStatus) {
            this.setState({
                show: true,
                height: offsetY,
                status: evaluateStatus
            });
        }
    }

    /*
    * 修改显示状态
    * */
    updateShowStatus = (status) => {
        this.setState({
            show: true,
            status: status
        });
    }

    /************************** List相关方法 **************************/
    /************************** Render中方法 **************************/
    render() {
        const { status, show } = this.state;
        const { footerViewBottomSpace = 12 } = this.props;
        if (!show || status == CZFlatListViewFooterViewStatus.Initialization) return null;

        let animating = false;
        let contentText = '';

        if (status == CZFlatListViewFooterViewStatus.ContinePull) {
            animating = true;
            contentText = '上拉加载';
        } else if (status == CZFlatListViewFooterViewStatus.PullGoToLoad) {
            animating = true;
            contentText = '松手即可加载数据...';
        } else if (status == CZFlatListViewFooterViewStatus.LoadingData) {
            animating = true;
            contentText = '正在加载更多数据...';
        } else if (status == CZFlatListViewFooterViewStatus.More) {
            contentText = '上拉加载更多';
        } else if (status == CZFlatListViewFooterViewStatus.All) {
            contentText = '已加载全部数据';
        } else if (status == CZFlatListViewFooterViewStatus.Fail) {
            contentText = '加载失败，请重试';
        } else if (status == CZFlatListViewFooterViewStatus.Empty) {
            contentText = '暂无数据';
        }

        return (
            <View style={[styles.MainView, {height: (30 + footerViewBottomSpace)}]}>
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
        height: 30,
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