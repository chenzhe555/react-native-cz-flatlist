import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { CZFlatListViewHeaderViewStatus } from './enum';

export default class FlatListHeaderRefreshView extends Component{

    /************************** 生命周期 **************************/
    constructor(props) {
        super(props);
        this.initializeParams();
        this.resetStatus();
    }

    componentDidMount() {
        if (this.props.evaluateView) this.props.evaluateView(this);
        this.isDidMounted = true;
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
        this.pullStatus = CZFlatListViewHeaderViewStatus.Initialization;
        this.state = {
            resultStatus: this.pullStatus
        };
    }

    /************************** 子组件回调方法 **************************/
    /************************** 外部调用方法 **************************/
    /*
    * 更新偏移量Y值
    * */
    updateContentOffsetY(offsetY) {
        if (this.pullStatus != CZFlatListViewHeaderViewStatus.LoadingData) {
            if (offsetY >= 10 && offsetY <= 40) {
                this.pullStatus = CZFlatListViewHeaderViewStatus.ContinePull;
            } else if (offsetY > 40) {
                this.pullStatus = CZFlatListViewHeaderViewStatus.PullGoToLoad;
            } else {
                this.pullStatus = CZFlatListViewHeaderViewStatus.Initialization;
            }
            this.setState({
                height: offsetY,
                resultStatus: this.pullStatus
            });
        }
    }

    /*
    * 重置组件状态
    * */
    resetStatus = () => {
        //初始化状态
        this.pullStatus = CZFlatListViewHeaderViewStatus.Initialization;
        if (this.isDidMounted) {
            this.setState({
                resultStatus: this.pullStatus
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
    * 下拉加载数据中
    * */
    loadData = () => {
        this.pullStatus = CZFlatListViewHeaderViewStatus.LoadingData;
        this.setState({
            resultStatus: this.pullStatus
        });
    }

    /*
    * 数据加载失败
    * */
    loadFail = () => {
        //初始化状态
        this.pullStatus = CZFlatListViewHeaderViewStatus.Initialization;
        this.setState({
            resultStatus: this.pullStatus
        });
    }
    /************************** List相关方法 **************************/
    /************************** Render中方法 **************************/
    render() {
        let height = this.state.height;
        const { resultStatus } = this.state;
        if (resultStatus == CZFlatListViewHeaderViewStatus.Initialization || resultStatus == CZFlatListViewHeaderViewStatus.All) return null;

        let animating = true;
        let contentText = '';
        if (resultStatus == CZFlatListViewHeaderViewStatus.ContinePull) {
            contentText = '下拉刷新';
        } else if (resultStatus == CZFlatListViewHeaderViewStatus.PullGoToLoad) {
            contentText = '松开刷新数据';
        } else if (resultStatus == CZFlatListViewHeaderViewStatus.LoadingData) {
            contentText = '正在刷新数据...';
            height = 30;
        } else if (resultStatus == CZFlatListViewHeaderViewStatus.Fail) {
            animating = false;
            contentText = '数据加载失败，请重试';
            height = 30;
            //1秒后自动消失
            setTimeout( () => {
                if (this.state.resultStatus == CZFlatListViewHeaderViewStatus.Fail) {
                    this.setState({
                        resultStatus: CZFlatListViewHeaderViewStatus.Initialization
                    });
                }
            }, 1000);
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
        top: 0,
        left: 0,
        right: 0,
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