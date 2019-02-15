//FlatList组件滚动状态
const CZFlatListViewPullStatus = {
    None: 1,                //正常滚动中
    PullDown: 2,            //下拉
    PullDownLoadData: 3,    //下拉加载数据中
    PullUp: 4,              //上拉
    PullUpLoadData: 5       //上拉加载数据中
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
    Fail: 7                 //数据加载失败
}

export {
    CZFlatListViewPullStatus,
    CZFlatListViewHeaderViewStatus,
    CZFlatListViewFooterViewStatus
}