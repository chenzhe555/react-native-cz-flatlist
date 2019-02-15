import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { CZFlatListViewPullStatus } from './enum';

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
        this.state = {
            show: false,
            height: 0,
            contentText: '',
            animating: false
        };
    }

    /*
    * 更新偏移量Y值
    * */
    updateContentOffsetY(offsetY) {
        if (!this.isUpdating && this.pullStatus != CZFlatListViewPullStatus.PullDownLoadData) {
            this.isUpdating = true;
            //显示文本信息
            let contentText = '';
            //菊花是否转动
            let animating = true;
            //是否显示
            let show = true;
            if (offsetY >= 10 && offsetY <= 36) {
                contentText = '下拉刷新';
                this.pullStatus = CZFlatListViewPullStatus.None;
            } else if (offsetY > 40) {
                contentText = '松开刷新数据';
                this.pullStatus = CZFlatListViewPullStatus.PullDown;
            } else {
                contentText = '';
                animating = false;
                this.pullStatus = CZFlatListViewPullStatus.None;
                show = false;
            }

            this.setState({
                show: show,
                height: offsetY,
                contentText: contentText,
                animating: animating
            }, () => {
                this.isUpdating = false;
            });
        }
    }

    /*
    * 下拉加载数据中
    * */
    loadData = () => {
        this.pullStatus = CZFlatListViewPullStatus.PullDownLoadData;
        this.setState({
            contentText: '正在刷新数据...',
            height: 30
        });
    }
    /************************** 子组件回调方法 **************************/
    /************************** 外部调用方法 **************************/
    /*
    * 重置组件状态
    * */
    resetStatus = () => {
        //是否正在更新组件
        this.isUpdating = false;
        //初始化状态
        this.pullStatus = CZFlatListViewPullStatus.None;
        if (this.isDidMounted) {
            this.setState({
                show: false,
                height: 0
            });
        }
    }

    /*
    * 获取当前状态
    * */
    getCurrentStatus = () => {
        return this.pullStatus;
    }
    /************************** List相关方法 **************************/
    /************************** Render中方法 **************************/
    render() {
        const { height, contentText, animating, show } = this.state;
        if (!show) return null;

        return (
            <View style={[styles.MainView, {height: show ? height : 0}]}>
                <View style={[styles.ContentView]}>
                    <ActivityIndicator animating={animating} hidesWhenStopped={true}></ActivityIndicator>
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