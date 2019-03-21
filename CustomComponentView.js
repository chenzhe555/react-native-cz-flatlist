import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

export default class CustomComponentView extends Component {

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
    initializeParams = () => {
        this.state = {
            show: false
        }
    }
    /************************** 子组件回调方法 **************************/
    /************************** 外部调用方法 **************************/
    /*
    * 修改显示状态
    * */
    modifyShowStatus = (show = false) => {
        if (this.state.show != show) {
            this.setState({
                show: show
            });
        }
    }
    /************************** List相关方法 **************************/
    /************************** Render中方法 **************************/

    render() {
        if (!this.state.show || this.props.customComponentView == null) return null;

        return (
            <View style={[styles.MainView]}>
                {this.props.customComponentView}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    MainView: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 10
    }
})