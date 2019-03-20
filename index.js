import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, PanResponder, Platform } from 'react-native';
import { CZFlatListViewRequestStatus, CZFlatListViewPullStatus, CZFlatListViewHeaderViewStatus, CZFlatListViewFooterViewStatus, CZFlatListViewScrollStatus } from './enum';
import FlatListHeaderView from './FlatListHeaderView';
import FlatListFooterView from './FlatListFooterView';
import EmptyComponentView from './EmptyComponentView';

/*
* props:
* pageCount: 每页数量，默认20,是否加载完按照传入数量判断，如果数量不等于pageCount，则认为加载完
* backgroundColor: 背景颜色，默认白色
* topLoadContentOffset: 顶部加载最大偏移量
* bottomLoadContentOffset: 底部加载最大偏移量
* ListHeaderComponent: 顶部组件
* ListFooterComponent: 底部组件
* ListEmptyComponent: 空数组视图
*
* func:
* evaluateView: 赋值当前视图对象
* renderItem: 渲染Cell
* refresh: 下拉刷新数据 callback({'fail': 1, 'list': [1,2,3]})
* loadMore: 上拉加载数据
* 
* export func:
* modifyDataList(list = []) 直接修改数据源
* */
export default class CZFlatListView extends Component{

    /************************** 生命周期 **************************/
    constructor(props) {
        super(props);
        this.initializeParams();
    }

    componentDidMount() {
        this._PullDownRefresh();
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
        //顶部最大偏移量
        this.topLoadContentOffset = this.props.topLoadContentOffset ? this.props.topLoadContentOffset : 40;
        //底部最大偏移量
        this.bottomLoadContentOffset = this.props.bottomLoadContentOffset ? this.props.bottomLoadContentOffset : 40;
        this.newListCount = -1;
        this.allListCount = -1;
        this.state = {
            list: []
        };
        //当前请求状态
        this.requestStatus = CZFlatListViewRequestStatus.None;
        //当前上/下拉组件状态
        this.pullStatus = CZFlatListViewPullStatus.Initialization;
        //当前滚动状态
        this.scrollStatus = CZFlatListViewScrollStatus.None;
        //每页数量
        this.pageCount = this.props.pageCount ? this.props.pageCount : 20;
        //底部组件状态
        this.footerStatus = CZFlatListViewFooterViewStatus.Initialization;
    }

    /*
    * 下拉刷新
    * */
    _refresh = (result) => {
        this.flatListHeaderView.updateShowStatus(CZFlatListViewHeaderViewStatus.Initialization);

        //加载成功/失败
        let fail = result['fail'] ? result['fail'] : 0;
        if (fail) {
            this.loadFailAction();
        } else {
            this.requestStatus = CZFlatListViewRequestStatus.RequestSuccess;
            let list = result['list'] ? result['list'] : [];
            this.newListCount = this.allListCount = list.length;
            this.setState({
                list: list
            }, () => {
                this.requestStatus = CZFlatListViewRequestStatus.None;
                this.flatlist.scrollToOffset({offset: 0});
                this.updateFooterShowStatus();
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
            this.loadFailAction();
        } else {
            this.requestStatus = CZFlatListViewRequestStatus.RequestSuccess;
            let originList = [].concat(this.state.list);
            let newList = result['list'] ? result['list'] : [];
            let list = originList.concat(newList);
            this.newListCount = newList.length;
            this.allListCount = list.length;
            this.setState({
                list: list
            }, () => {
                this.requestStatus = CZFlatListViewRequestStatus.None;
                this.updateFooterShowStatus();
            });
        }
    }

    /*
    * 数据加载失败
    * */
    loadFailAction = () => {
        this.footerStatus = CZFlatListViewFooterViewStatus.Fail;
        this.flatlist.scrollToOffset({offset: 0});
        this.requestStatus = CZFlatListViewRequestStatus.RequestFail;
    }

    /*
    * 更新底部组件显示状态
    * */
    updateFooterShowStatus = () => {
        if (this.allListCount == -1) return;

        if (this.allListCount == 0) {
            this.emptyComponentView.modifyShowStatus(true);
            this.footerStatus = CZFlatListViewFooterViewStatus.Empty;
        } else {
            this.emptyComponentView.modifyShowStatus(false);
            if (this.newListCount != this.pageCount) {
                this.footerStatus = CZFlatListViewFooterViewStatus.All;
            } else {
                this.footerStatus = CZFlatListViewFooterViewStatus.More;
            }
        }
        this.flatListFooterView.updateShowStatus(this.footerStatus);
    }
    /************************** 子组件回调方法 **************************/
    /************************** 外部调用方法 **************************/
    /*
    * 直接修改数据源
    * */
    modifyDataList(list = []) {
        this.setState({
            list: list
        });
    }
    /************************** List相关方法 **************************/
    /*
    * 渲染Cell
    * */
    _renderItem = (item) => {
        if (this.props.renderItem) return this.props.renderItem(item);
        else return null;
    }

    /*
    * 下拉刷新
    * */
    _PullDownRefresh = () => {
        //如果正在请求，则不进行处理
        if (this.requestStatus == CZFlatListViewRequestStatus.PullDown || this.requestStatus == CZFlatListViewRequestStatus.PullUp) return;

        if (this.props.refresh) {
            this.requestStatus = CZFlatListViewRequestStatus.PullDown;
            this.flatlist.scrollToOffset({offset: -30});
            this.flatListHeaderView.updateShowStatus(CZFlatListViewHeaderViewStatus.LoadingData);
            this.props.refresh(this._refresh);
        }
    }

    /*
    * 上拉加载
    * */
    _PullUpRefresh = () => {
        //如果正在请求，则不进行处理
        if (this.requestStatus == CZFlatListViewRequestStatus.PullDown || this.requestStatus == CZFlatListViewRequestStatus.PullUp || this.footerStatus == CZFlatListViewFooterViewStatus.All) return;

        if (this.props.loadMore) {
            this.requestStatus = CZFlatListViewRequestStatus.PullUp;
            this.flatListFooterView.updateShowStatus(CZFlatListViewFooterViewStatus.LoadingData);
            this.props.loadMore(this._loadMore);
        }
    }

    /*
   * 下拉刷新，上拉加载判断逻辑
   * */
    _onScroll = (event) => {
        if (this.scrollStatus == CZFlatListViewScrollStatus.EndDrag) return;

        //如果松开手后，ScrollView还会滑动一段距离，需要更新底部视图位置
        const { contentOffset } = event.nativeEvent;
        this.contentOffsetY = contentOffset.y;

        const { totalHeight, contentOffsetY, contentSizeHeight, footerStatus, requestStatus } = this;
        if (this.contentOffsetY < 0) {
            this.flatListHeaderView.updateContentOffsetY(-contentOffsetY, requestStatus == CZFlatListViewRequestStatus.PullDown ? CZFlatListViewHeaderViewStatus.LoadingData : -1);
        } else {
            if (footerStatus != CZFlatListViewFooterViewStatus.All) {
                if (contentSizeHeight > totalHeight) {
                    let bottomSpace = totalHeight + contentOffsetY - contentSizeHeight;
                    if (bottomSpace >= 0) {
                        this.flatListFooterView.updateContentOffsetY(bottomSpace, requestStatus == CZFlatListViewRequestStatus.PullUp ? CZFlatListViewFooterViewStatus.LoadingData : -1);
                    }
                } else {
                    this.flatListFooterView.updateContentOffsetY(contentOffsetY, requestStatus == CZFlatListViewRequestStatus.PullUp ? CZFlatListViewFooterViewStatus.LoadingData : -1);
                }
            }
        }
    }

    /*
    * 手势开始滚动
    * */
    _onScrollBeginDrag = () => {
        this.scrollStatus = CZFlatListViewScrollStatus.Scrolling;
    }

    /*
    * 手势结束滚动
    * */
    _onScrollEndDrag = () => {
        const { topLoadContentOffset, bottomLoadContentOffset, totalHeight, contentOffsetY, contentSizeHeight } = this;

        this.scrollStatus = CZFlatListViewScrollStatus.EndDrag;
        if (this.contentOffsetY < 0) {
            // -contentOffsetY 偏移量
            if (-contentOffsetY > topLoadContentOffset) {
                this._PullDownRefresh();
            } else {
                this.flatListHeaderView.updateShowStatus(CZFlatListViewHeaderViewStatus.Initialization);
            }
        } else {
            if (this.footerStatus != CZFlatListViewFooterViewStatus.All) {
                if (contentSizeHeight > totalHeight) {
                    let bottomSpace = totalHeight + contentOffsetY - contentSizeHeight;
                    //bottomSpace: 偏移量
                    if (bottomSpace > bottomLoadContentOffset) {
                        this._PullUpRefresh();
                    }
                } else {
                    // contentOffsetY 偏移量
                    if (this.contentOffsetY > bottomLoadContentOffset) {
                        this._PullUpRefresh();
                    }
                }
            }
        }

    }

    /*
    * 滚动动画结束
    * */
    _onMomentumScrollEnd = () => {
        this.updateFooterShowStatus();
    }

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
        } else {
            this.isCacheOnContentSizeChange = true;
            this.isCacheOnContentSizeChangeWidth = width;
            this.isCacheOnContentSizeChangeHeight = height;
        }
    }

    /*
    * 渲染头部视图
    * */
    _renderListHeaderComponent = () => {
        let headerElement = this.props.ListHeaderComponent();
        if (!headerElement) return null;

        return (
            <View>
                {headerElement}
            </View>
        )
    }

    /*
     * 渲染底部视图
     * */
    _renderListFooterComponent = () => {
        let footerElement = this.props.ListFooterComponent();

        const { bottomLoadContentOffset } = this;
        return (
            <View>
                {
                    footerElement ? (
                        <View>
                            {footerElement}
                        </View>
                    ) : null
                }
                <FlatListFooterView
                    evaluateView={ (flatListFooterView) => {this.flatListFooterView = flatListFooterView} }
                    bottomLoadContentOffset={bottomLoadContentOffset}
                />
            </View>
        );
    }
    /************************** Render中方法 **************************/

    render() {
        const { list } = this.state;
        const { backgroundColor = 'white', ListEmptyComponent = null} = this.props;
        const { topLoadContentOffset } = this;

        let flatList = null;
        if (Platform.OS == 'ios') {
            flatList = (
                <FlatList
                    ref={(flatlist) => {this.flatlist = flatlist}}
                    style={[{ flex: 1, backgroundColor: backgroundColor}]}
                    data={list}
                    renderItem={this._renderItem}
                    extraData={this.state}
                    keyExtractor={(item, index) => { return "flatListIndex" + index }}
                    ListHeaderComponent={this._renderListHeaderComponent}
                    ListFooterComponent={this._renderListFooterComponent}
                    onScroll={this._onScroll.bind(this)}
                    onContentSizeChange={this._onContentSizeChange}
                    onScrollBeginDrag={this._onScrollBeginDrag}
                    onScrollEndDrag={this._onScrollEndDrag}
                    onMomentumScrollEnd={this._onMomentumScrollEnd}
                />
            );
        } else {
            flatList = (
                <FlatList
                    ref={(flatlist) => {this.flatlist = flatlist}}
                    style={[{ flex: 1, backgroundColor: backgroundColor}]}
                    data={list}
                    renderItem={this._renderItem}
                    extraData={this.state}
                    keyExtractor={(item, index) => { return "flatListIndex" + index }}
                    ListHeaderComponent={this._renderListHeaderComponent}
                    ListFooterComponent={this._renderListFooterComponent}
                    refreshing={false}
                    onRefresh={this._PullDownRefresh.bind(this)}
                    onEndReached={this._PullUpRefresh.bind(this)}
                    onEndReachedThroshold={0.01}
                />
            );
        }

        return (
            <View style={[{flex: 1}]} onLayout={this._onLayout}>
                <EmptyComponentView evaluateView={ (emptyComponentView) => {this.emptyComponentView = emptyComponentView} } emptyComponent={ListEmptyComponent}/>
                <FlatListHeaderView
                    evaluateView={ (flatListHeaderView) => {this.flatListHeaderView = flatListHeaderView} }
                    backgroundColor={backgroundColor}
                    topLoadContentOffset={topLoadContentOffset}
                />
                {flatList}
            </View>
        )
    }
}