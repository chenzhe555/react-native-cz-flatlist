import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { CZFlatListViewHeaderViewStatus } from './enum';

export default class FlatListHeaderView extends Component{

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
            status: CZFlatListViewHeaderViewStatus.Initialization,
            show: false,
            height: 0
        };
    }

    /************************** 子组件回调方法 **************************/
    /************************** 外部调用方法 **************************/

    /*
    * 修改显示状态
    * */
    updateShowStatus = (status) => {
        this.setState({
            show: true,
            status: status
        });
    }

    /*
    * 获取偏移量
    * offsetY: 偏移量
    * originStatus: 如果正在请求，则保持加载中，不修改状态
    * */
    updateContentOffsetY = (offsetY, originStatus = -1) => {
        const { topLoadContentOffset } = this.props;
        let status;
        if (offsetY >= 10 && offsetY <= topLoadContentOffset) {
            status = CZFlatListViewHeaderViewStatus.ContinePull;
        } else if (offsetY > topLoadContentOffset) {
            status = CZFlatListViewHeaderViewStatus.PullGoToLoad;
        } else {
            status = CZFlatListViewHeaderViewStatus.Initialization;
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

    /************************** List相关方法 **************************/
    /************************** Render中方法 **************************/
    render() {
        const { status, show } = this.state;
        const { backgroundColor } = this.props;
        if (!show || status == CZFlatListViewHeaderViewStatus.Initialization || status == CZFlatListViewHeaderViewStatus.All) return null;

        let height = this.state.height;

        let animating = true;
        let contentText = '';
        if (status == CZFlatListViewHeaderViewStatus.ContinePull) {
            contentText = '下拉刷新';
        } else if (status == CZFlatListViewHeaderViewStatus.PullGoToLoad) {
            contentText = '松开刷新数据';
        } else if (status == CZFlatListViewHeaderViewStatus.LoadingData) {
            contentText = '正在刷新数据...';
            height = 30;
        } else if (status == CZFlatListViewHeaderViewStatus.Fail) {
            animating = false;
            contentText = '加载失败，请重试';
            height = 30;
            //1秒后自动消失
            setTimeout( () => {
                this.setState({
                    show: false
                });
            }, 1000);
        }

        return (
            <View style={[styles.MainView, {height: height, backgroundColor: backgroundColor}]}>
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
        alignItems: 'center',
        zIndex: 5
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