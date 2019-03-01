import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { CZFlatListViewHeaderViewStatus } from './Oldenum';

export default class OldFlatListHeaderRefreshView extends Component{

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
            resultStatus: CZFlatListViewHeaderViewStatus.Initialization,
            show: false
        };
    }

    /************************** 子组件回调方法 **************************/
    /************************** 外部调用方法 **************************/
    /*
    * 更新底部视图显示状态
    * */
    updateViewShowStatus = (show, status = CZFlatListViewHeaderViewStatus.Initialization, offsetY = 0) => {
        this.setState({
            show: show,
            height: offsetY,
            resultStatus: status
        });
    }

    /*
    * 下拉加载数据中
    * */
    loadData = () => {
        this.setState({
            resultStatus: CZFlatListViewHeaderViewStatus.LoadingData,
            show: true
        });
    }

    /*
    * 数据加载失败
    * */
    loadFail = () => {
        //初始化状态
        this.setState({
            resultStatus: CZFlatListViewHeaderViewStatus.Fail,
            show: true
        });
    }
    /************************** List相关方法 **************************/
    /************************** Render中方法 **************************/
    render() {
        let height = this.state.height;
        const { resultStatus, show } = this.state;
        if (!show || resultStatus == CZFlatListViewHeaderViewStatus.Initialization || resultStatus == CZFlatListViewHeaderViewStatus.All) return null;

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
                        show: false
                    });
                    if (this.props.scrollToTop) this.props.scrollToTop();
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