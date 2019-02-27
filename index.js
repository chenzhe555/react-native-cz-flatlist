import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, PanResponder } from 'react-native';
import FlatListHeaderRefreshView from './FlatListHeaderRefreshView';
import FlatListFooterRefreshView from './FlatListFooterRefreshView';
import { CZFlatListViewHeaderViewStatus, CZFlatListViewFooterViewStatus } from './enum';

/*
* props:
* pageCount: 每页数量，默认20,是否加载完按照传入数量判断，如果数量不等于pageCount，则认为加载完
* 
* func:
* renderItem: 渲染Cell
* refresh: 下拉刷新数据
* loadMore: 上拉加载数据
* */
export default class CZFlatListView extends Component{

    /************************** 生命周期 **************************/
    constructor(props) {
        super(props);
        this.initializeParams();
        this.addGesture();
    }

    componentDidMount = () => {
        //先刷新数据
        if (this.props.evaluateView) this.props.evaluateView(this);
        this.pullDownFunc();
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
            list: []
        };
        this.pullStatus = CZFlatListViewHeaderViewStatus.Initialization;
        //底部视图当前状态值，用于数据加载完后不再请求数据
        this.footerResultStatus = CZFlatListViewFooterViewStatus.Initialization;
        this.pageCount = this.props.pageCount ? this.props.pageCount : 20;
        this.endDragFlag = true;
    }

    /*
    * 添加手势，通知上下拉组件触发时机
    * */
    addGesture = () => {
        this.panGesture = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {this.notifyGestureReset();},
            onPanResponderRelease: (evt, gestureState) => {this.notifyGestureEnd();},
            onPanResponderTerminate: (evt, gestureState) => {this.notifyGestureReset();}
        })
    }

    /*
    * 重置手势事件
    * */
    notifyGestureReset = () => {
        this.flatListHeaderRefreshView.resetStatus();
        this.flatListFooterRefreshView.resetStatus();
    }

    /*
    * 手势结束事件
    * */
    notifyGestureEnd = () => {
        this.pullStatus = this.flatListHeaderRefreshView.getCurrentStatus();
        if (this.pullStatus == CZFlatListViewHeaderViewStatus.PullGoToLoad) {
            this.pullDownFunc();
        } else {
            //再判断是否是上拉加载更多数据
            this.pullStatus = this.flatListFooterRefreshView.getCurrentStatus();
            if (this.pullStatus == CZFlatListViewFooterViewStatus.PullGoToLoad) {
                //上拉组件更改为正在请求数据
                this.flatListFooterRefreshView.loadData();
                if (this.props.loadMore) this.props.loadMore(this._loadMore);
            } else {
                this.flatListHeaderRefreshView.resetStatus();
                this.flatListFooterRefreshView.resetStatus();
            }
        }
    }

    /*
    * 下拉事件
    * */
    pullDownFunc = () => {
        //FlatList偏移HeaderView高度
        this.flatlist.scrollToOffset({offset: -30});
        //下拉组件更改为正在请求数据
        this.flatListHeaderRefreshView.loadData();
        //请求数据
        if (this.props.refresh) this.props.refresh(this._refresh);
    }

    /*
    * 下拉刷新
    * */
    _refresh = (result) => {
        //加载成功/失败
        let fail = result['fail'] ? result['fail'] : 0;
        if (fail) {
            this.flatListHeaderRefreshView.loadFail();
        } else {
            let newList = result['list'] ? result['list'] : [];
            this.setState({
                list: newList
            }, () => {
                this.flatlist.scrollToOffset({offset: 0});
                //下拉组件更改为初始状态
                this.flatListHeaderRefreshView.resetStatus();
                this.flatListFooterRefreshView.resetStatus();
                this.updateFooterViewShowStatus(newList.length);
            });
        }
    }

    /*
    * 上拉加载更多
    * */
    _loadMore = (result) => {
        //加载成功/失败
        let fail = result['fail'] ? result['fail'] : 0;
        if (fail) {
            this.flatListFooterRefreshView.loadFail();
        } else {
            let originList = [].concat(this.state.list);
            let newList = result['list'] ? result['list'] : [];
            this.setState({
                list: originList.concat(newList)
            }, () => {
                this.updateFooterViewShowStatus(newList.length);
            });
        }

    }

    /*
    * 更新底部视图显示文本信息
    * */
    updateFooterViewShowStatus = (listCount) => {
        if (listCount != this.pageCount) {
            this.footerResultStatus = CZFlatListViewFooterViewStatus.All;
        } else {
            this.footerResultStatus = CZFlatListViewFooterViewStatus.More;
        }
        this.flatListFooterRefreshView.modifyShowStatus(this.footerResultStatus);
    }

    /*
    * 更新底部视图的位置
    * */
    updateFooterViewDownLocation = (offset = 0) => {
        this.flatListFooterRefreshView.modifyShowStatus(CZFlatListViewFooterViewStatus.Initialization, this.totalHeight > this.contentSizeHeight ? this.totalHeight - this.contentSizeHeight - offset : 0);
    }
    /************************** 子组件回调方法 **************************/
    /************************** 外部调用方法 **************************/
    /************************** List相关方法 **************************/
    /*
    * 渲染Cell事件
    * */
    _renderItem = (item) => {
        if (this.props.renderItem) return this.props.renderItem(item);
        else return null;
    }

    /*
    * 下拉刷新，上拉加载判断逻辑
    * */
    _onScroll = (event) => {
        //如果FlatList停止滚动了，不再执行加载效果
        if (this.endDragFlag) return;

        const { contentOffset } = event.nativeEvent;
        let headerStatus = this.flatListHeaderRefreshView.getCurrentStatus();
        let footerStatus = this.flatListFooterRefreshView.getCurrentStatus();
        if (contentOffset.y < 0) {
            this.pullStatus = headerStatus;
            //如果下拉正在请求数据，则不再显示加载效果
            if (headerStatus != CZFlatListViewHeaderViewStatus.LoadingData && footerStatus != CZFlatListViewFooterViewStatus.LoadingData) {
                //下拉刷新
                if(this.flatListHeaderRefreshView) this.flatListHeaderRefreshView.updateContentOffsetY(-contentOffset.y);
                this.onScrollUpdateFooterView(event, 1);
            }
        } else {
            //如果上拉正在请求数据，则不再显示加载效果
            this.pullStatus = footerStatus;
            if (headerStatus != CZFlatListViewHeaderViewStatus.LoadingData && footerStatus != CZFlatListViewFooterViewStatus.LoadingData) {
                this.onScrollUpdateFooterView(event, 2);
            }
        }
    }

    /*
    * 更新底部视图的位置坐标
    * type: 1.下拉时底部组件的滚动事件 2.下拉时底部组件的滚动事件 3.数据加载完的情况 4.同2，4是指contentSizeHeight < totalHeight的情况
    * */
    onScrollUpdateFooterView = (event, type) => {
        //如果是上拉且数据已经加载完毕，则只更新坐标，不修改文本信息
        if (type == 2 && this.footerResultStatus == CZFlatListViewFooterViewStatus.All) type = 3;
        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
        const { totalHeight, contentSizeHeight } = this;


        let downOffset = 0;
        //上拉加载更多
        if (contentSizeHeight >= totalHeight) {
            downOffset = contentOffset.y + totalHeight - contentSizeHeight;
            if (downOffset > 0) {
                if(this.flatListFooterRefreshView) this.flatListFooterRefreshView.updateContentOffsetY(type, downOffset, downOffset);
            }
        } else {
            if (type == 2) type = 4;
            if(this.flatListFooterRefreshView) this.flatListFooterRefreshView.updateContentOffsetY(type, totalHeight - contentSizeHeight + contentOffset.y, contentOffset.y);
        }
    }
    /************************** Render中方法 **************************/
    /*
    * 页面布局回调事件，获取当前高度
    * */
    _onLayout = (event) => {
        //由于_onLayout和_onContentSizeChange先后执行的次序不是一定的，所以有可能存在 _onContentSizeChange 先于 _onLayout调用，导致 后续用到的 this.totalHeight 为undefined
        this.isOnLayoutExecute = true;
        this.totalHeight = event.nativeEvent.layout.height;
        this.contentSizeHeight = 0;
        if (this.isCacheOnContentSizeChange) this._onContentSizeChange(this.isCacheOnContentSizeChangeWidth, this.isCacheOnContentSizeChangeHeight);
    }

    /*
    * FlatList ContentSize变化回调事件
    * */
    _onContentSizeChange = (width, height) => {
        //如果 _onContentSizeChange 先于 _onLayout调用执行，缓存记录再执行
        if (this.isOnLayoutExecute) {
            this.contentSizeHeight = height;
            if (this.pullStatus == CZFlatListViewHeaderViewStatus.LoadingData) {
                //显示下拉刷新效果中
                this.updateFooterViewDownLocation(30);
            } else {
                this.updateFooterViewDownLocation(0);
            }
        } else {
            this.isCacheOnContentSizeChange = true;
            this.isCacheOnContentSizeChangeWidth = width;
            this.isCacheOnContentSizeChangeHeight = height;
        }
        this.flatListFooterRefreshView.modifyShowStatus(this.footerResultStatus);
    }

    /*
    * 开始滚动
    * */
    _onScrollBeginDrag = () => {
        this.endDragFlag = false;
    }

    /*
    * 停止滚动
    * */
    _onScrollEndDrag = () => {
        this.endDragFlag = true;
        this.pullStatus = CZFlatListViewHeaderViewStatus.Initialization;
        this.updateFooterViewDownLocation(0);
    }

    render() {
        const { list } = this.state;

        return (
            <View style={[styles.MainView]} onLayout={this._onLayout}>
                <FlatListHeaderRefreshView evaluateView={ (flatListHeaderRefreshView) => {this.flatListHeaderRefreshView = flatListHeaderRefreshView} }></FlatListHeaderRefreshView>
                <FlatList
                    ref={(flatlist) => {this.flatlist = flatlist}}
                    style={[styles.FlatListView]}
                    refreshing={false}
                    data={list}
                    extraData={this.state}
                    renderItem={this._renderItem.bind(this)}
                    keyExtractor={ (item, index) => {return "index" + index}}
                    onScroll={this._onScroll.bind(this)}
                    scrollEventThrottle={24}
                    onContentSizeChange={this._onContentSizeChange}
                    onScrollBeginDrag={this._onScrollBeginDrag}
                    onScrollEndDrag={this._onScrollEndDrag}
                    {...this.panGesture.panHandlers}
                />
                <FlatListFooterRefreshView evaluateView={ (flatListFooterRefreshView) => {this.flatListFooterRefreshView = flatListFooterRefreshView} }></FlatListFooterRefreshView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    MainView: {
        flex: 1
    },

    FlatListView: {
        flex: 1
    }
})

