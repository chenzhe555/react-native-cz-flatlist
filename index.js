import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, PanResponder } from 'react-native';
import FlatListHeaderRefreshView from './FlatListHeaderRefreshView';
import FlatListFooterRefreshView from './FlatListFooterRefreshView';
import { CZFlatListViewPullStatus, CZFlatListViewScrollStatus, CZFlatListViewHeaderViewStatus, CZFlatListViewFooterViewStatus } from './enum';

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
        //当前上/下拉组件状态
        this.pullStatus = CZFlatListViewPullStatus.Initialization;
        //顶部视图状态值
        this.headerResultStatus = this.headerScrollStatus = CZFlatListViewHeaderViewStatus.Initialization;
        //底部视图状态值
        this.footerResultStatus = this.footerScrollStatus = CZFlatListViewFooterViewStatus.Initialization;
        //当前滚动状态
        this.scrollStatus = CZFlatListViewScrollStatus.None;
        //偏移量
        this.contentOffsetY = 0;
        //每页数量
        this.pageCount = this.props.pageCount ? this.props.pageCount : 20;
        //正在请求数据
        this.isRequestData = false;
    }

    /*
    * 下拉事件
    * type: 1.隐藏下拉组件 2.不隐藏下拉组件
    * */
    pullDownFunc = (type = 1) => {
        //FlatList偏移HeaderView高度
        this.flatlist.scrollToOffset({offset: -30});
        //下拉组件更改为正在请求数据
        this.flatListHeaderRefreshView.loadData();
        if (type == 1) this.updateFooterViewFrame(false);
        //请求数据
        this.headerResultStatus = CZFlatListViewHeaderViewStatus.LoadingData;
        if (!this.isRequestData) {
            this.isRequestData = true;
            if (this.props.refresh) this.props.refresh(this._refresh);
        }
    }

    /*
    * 下拉刷新
    * */
    _refresh = (result) => {
        this.isRequestData = fail;
        //加载成功/失败
        let fail = result['fail'] ? result['fail'] : 0;
        if (fail) {
            this.headerResultStatus = CZFlatListViewHeaderViewStatus.Fail;
            this.flatListHeaderRefreshView.loadFail();
        } else {
            this.headerResultStatus = CZFlatListViewHeaderViewStatus.Initialization;
            let newList = result['list'] ? result['list'] : [];
            this.setState({
                list: newList
            }, () => {
                this.flatlist.scrollToOffset({offset: 0});
                this.onScrollUpdateHeaderView(false);
                this.updateFooterViewShowStatus(newList.length, this.state.list.length);
            });
        }
    }

    /*
    * 上拉加载更多
    * */
    _loadMore = (result) => {
        this.isRequestData = fail;
        //加载成功/失败
        let fail = result['fail'] ? result['fail'] : 0;
        if (fail) {
            this.footerResultStatus = CZFlatListViewFooterViewStatus.Fail;
            this.flatListFooterRefreshView.loadFail();
        } else {
            let originList = [].concat(this.state.list);
            let newList = result['list'] ? result['list'] : [];
            this.setState({
                list: originList.concat(newList)
            }, () => {
                this.onScrollUpdateHeaderView(false);
                this.updateFooterViewShowStatus(newList.length, this.state.list.length);
            });
        }

    }

    /*
    * 更新底部视图显示文本信息
    * */
    updateFooterViewShowStatus = (listCount, allCount) => {
        if (allCount == 0) {
            this.footerResultStatus = CZFlatListViewFooterViewStatus.Empty;
        } else {
            if (listCount != this.pageCount) {
                this.footerResultStatus = CZFlatListViewFooterViewStatus.All;
            } else {
                this.footerResultStatus = CZFlatListViewFooterViewStatus.More;
            }
        }
        this.updateFooterViewFrame(true, 1, this.footerResultStatus);
    }

    /************************** 子组件回调方法 **************************/
    _scrollToTop = () => {
        this.flatlist.scrollToOffset({offset: 0});
    }
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
        //如果松开手后，ScrollView还会滑动一段距离，需要更新底部视图位置
        const { contentOffset } = event.nativeEvent;
        this.contentOffsetY = contentOffset.y;

        //如果正在请求数据，则只更新位置
        if (this.isRequestData) {
            //只更新底部视图
            this.evaluateFlatHeaderAndFooterScrollStatus(3);
        } else {
            if (contentOffset.y < 0) {
                this.pullStatus = CZFlatListViewPullStatus.PullDown;
                this.evaluateFlatHeaderAndFooterScrollStatus(1);
                this.evaluateFlatHeaderAndFooterScrollStatus(3);
            } else {
                this.pullStatus = CZFlatListViewPullStatus.PullUp;
                this.evaluateFlatHeaderAndFooterScrollStatus(2);
            }
        }
    }

    /*
    * 计算上/下拉组件的滚动显示状态
    * type: 1.下拉 2.上拉 3.上拉，只更新位置
    * */
    evaluateFlatHeaderAndFooterScrollStatus = (type = 1) => {
        if (type == 1) {
            if (-this.contentOffsetY >= 10 && -this.contentOffsetY <= 40) {
                this.headerScrollStatus = CZFlatListViewHeaderViewStatus.ContinePull;
            } else if (-this.contentOffsetY > 40) {
                this.headerScrollStatus = CZFlatListViewHeaderViewStatus.PullGoToLoad;
            } else {
                this.headerScrollStatus = CZFlatListViewHeaderViewStatus.Initialization;
            }
            this.onScrollUpdateHeaderView(true);
        } else if (type == 2) {
            this.onScrollUpdateFooterView(3)
        } else if (type == 3) {
            this.onScrollUpdateFooterView(1);
        }
    }

    /*
    * 更新顶部视图的位置坐标
    * show: 是否显示
    * contentOffsetY: 顶部组件偏移量
    * */
    onScrollUpdateHeaderView = (show) => {
        if(this.flatListHeaderRefreshView) this.flatListHeaderRefreshView.updateViewShowStatus(show, this.headerScrollStatus, -this.contentOffsetY);
    }

    /*
    * 更新底部视图的位置坐标
    * type: 1.只更新位置 2.只更新状态 3.位置和状态都更新
    * */
    onScrollUpdateFooterView = (type) => {
        const { totalHeight, contentSizeHeight, footerResultStatus, footerScrollStatus } = this;
        //上拉加载更多
        if (contentSizeHeight >= totalHeight) {
            let bottomSpace = totalHeight + this.contentOffsetY - contentSizeHeight;
            if (bottomSpace >= 0) {
                if (bottomSpace > 36) {
                    this.footerScrollStatus = CZFlatListViewFooterViewStatus.PullGoToLoad;
                } else {
                    this.footerScrollStatus = CZFlatListViewFooterViewStatus.ContinePull;
                }
                this.updateFooterViewFrame(true, type, footerResultStatus == CZFlatListViewFooterViewStatus.All ? footerResultStatus : footerScrollStatus, totalHeight - bottomSpace);
            } else {
                this.updateFooterViewFrame(false);
            }
        } else {
            if (this.contentOffsetY > 36) {
                this.footerScrollStatus = CZFlatListViewFooterViewStatus.PullGoToLoad;
            } else {
                this.footerScrollStatus = CZFlatListViewFooterViewStatus.ContinePull;
            }
            this.updateFooterViewFrame(true, type, footerResultStatus == CZFlatListViewFooterViewStatus.All ? footerResultStatus : footerScrollStatus, contentSizeHeight - this.contentOffsetY);
        }
    }

    /*
    * 更新底部视图位置
    * type: 1.只更新位置 2.只更新状态 3.位置和状态都更新
    * */
    updateFooterViewFrame = (show, type = 1, status = 1, top = -1) => {
        if(this.flatListFooterRefreshView) this.flatListFooterRefreshView.updateViewShowStatus(show, type, status, top);
    }
    /************************** Render中方法 **************************/
    /*
    * 页面布局回调事件，获取当前高度
    * */
    _onLayout = (event) => {
        //由于_onLayout和_onContentSizeChange先后执行的次序不是一定的，所以有可能存在 _onContentSizeChange 先于 _onLayout调用，导致 后续用到的 this.totalHeight 为undefined
        this.isOnLayoutExecute = true;
        this.totalHeight = event.nativeEvent.layout.height;
        if (this.isCacheOnContentSizeChange) this._onContentSizeChange(this.isCacheOnContentSizeChangeWidth, this.isCacheOnContentSizeChangeHeight);
    }

    /*
    * FlatList ContentSize变化回调事件
    * */
    _onContentSizeChange = (width, height) => {
        //如果 _onContentSizeChange 先于 _onLayout调用执行，缓存记录再执行
        if (this.isOnLayoutExecute) {
            //每次ContentSize变化都更新高度
            this.contentSizeHeight = height;
            //同时更新底部视图的位置
            this.onScrollUpdateFooterView(1);
            this.updateFooterViewFrame(false, 2, this.footerResultStatus);
        } else {
            this.isCacheOnContentSizeChange = true;
            this.isCacheOnContentSizeChangeWidth = width;
            this.isCacheOnContentSizeChangeHeight = height;
        }
    }

    /*
    * 用户开始滑动
    * */
    _onScrollBeginDrag = () => {
        this.scrollStatus = CZFlatListViewScrollStatus.Scrolling;
    }

    /*
    * 用户手松开
    * */
    _onScrollEndDrag = () => {
        this.scrollStatus = CZFlatListViewScrollStatus.EndDrag;
        const { pullStatus, contentOffsetY, headerScrollStatus, footerScrollStatus } = this;

        if (pullStatus == CZFlatListViewPullStatus.PullDown) {
            if (headerScrollStatus == CZFlatListViewHeaderViewStatus.PullGoToLoad) {
                //下拉刷新
                this.pullDownFunc(2);
            }
        } else if (pullStatus == CZFlatListViewPullStatus.PullUp) {
            //上拉加载
            if (footerScrollStatus == CZFlatListViewFooterViewStatus.PullGoToLoad && this.footerResultStatus != CZFlatListViewFooterViewStatus.All) {
                this.flatListFooterRefreshView.loadData();
                if (!this.isRequestData) {
                    this.isRequestData = true;
                    if (this.props.loadMore) this.props.loadMore(this._loadMore);
                }
            } else {
                this.updateFooterViewFrame(false, 2, this.footerResultStatus);
            }
        }
    }

    /*
    * ScrollView滚动动画结束
    * */
    _onMomentumScrollEnd = () => {
        //重置状态
        this.scrollStatus = CZFlatListViewScrollStatus.EndScroll;
        this.pullStatus = CZFlatListViewPullStatus.Initialization;
        this.headerResultStatus = CZFlatListViewHeaderViewStatus.Initialization;
        this.updateFooterViewFrame(true, 2, this.footerResultStatus);
    }

    render() {
        const { list } = this.state;

        return (
            <View style={[styles.MainView]} onLayout={this._onLayout}>
                <FlatListHeaderRefreshView
                    evaluateView={ (flatListHeaderRefreshView) => {this.flatListHeaderRefreshView = flatListHeaderRefreshView} }
                    scrollToTop={this._scrollToTop}
                />
                <FlatList
                    ref={(flatlist) => {this.flatlist = flatlist}}
                    style={[styles.FlatListView]}
                    refreshing={false}
                    data={list}
                    extraData={this.state}
                    renderItem={this._renderItem.bind(this)}
                    keyExtractor={ (item, index) => {return "index" + index}}
                    onScroll={this._onScroll.bind(this)}
                    scrollEventThrottle={40}
                    onContentSizeChange={this._onContentSizeChange}
                    onScrollBeginDrag={this._onScrollBeginDrag}
                    onScrollEndDrag={this._onScrollEndDrag}
                    onMomentumScrollEnd={this._onMomentumScrollEnd}
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

