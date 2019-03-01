//FlatList组件Pull加载状态
const CZFlatListViewPullStatus = {
    Initialization: 1,      //初始化状态
    PullDown: 2,            //下拉
    PullUp: 3               //上拉
}

//FlatList组件滚动状态
const CZFlatListViewScrollStatus = {
    None: 1,                //没有滚动
    Scrolling: 2,           //正在滚动
    EndDrag: 3,             //用户松开手指
    EndScroll: 4            //ScrollView停止滚动
}

/*
* 顶部视图加载枚举类型
* */
const CZFlatListViewHeaderViewStatus = {
    Initialization: 1,      //初始化状态
    ContinePull: 2,         //下拉加载
    PullGoToLoad: 3,        //松手开始下拉加载
    LoadingData: 4,         //正在请求数据
    All: 5,                 //已加载数据
    Fail: 6                 //数据加载失败
}

/*
* 底部视图加载枚举类型
* */
const CZFlatListViewFooterViewStatus = {
    Initialization: 1,      //初始化状态
    ContinePull: 2,         //上拉加载
    PullGoToLoad: 3,        //松手开始上拉加载
    LoadingData: 4,         //正在请求数据
    More: 5,                //上拉加载更多数据
    All: 6,                 //已加载全部数据
    Fail: 7,                //数据加载失败
    Empty: 8                //空数据
}

export {
    CZFlatListViewPullStatus,
    CZFlatListViewScrollStatus,
    CZFlatListViewHeaderViewStatus,
    CZFlatListViewFooterViewStatus
}