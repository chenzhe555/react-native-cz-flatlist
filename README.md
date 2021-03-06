## Manual installation

npm install react-native-cz-flatlist --save


## Usage
###  1.引入组件
```
import FlatListView from 'react-native-cz-flatlist';

<FlatListView 
    renderItem={this._renderItem} 
    refresh={this._refresh} 
    loadMore={this._loadMore}
/> 
```

###  2.属性:
```
pageCount: 每页数量，默认20,是否加载完按照传入数量判断，如果数量不等于pageCount，则认为加载完
```
```
backgroundColor: 背景颜色，默认白色
```
```
topLoadContentOffset: 顶部加载最大偏移量
```
```
bottomLoadContentOffset: 底部加载最大偏移量
```
```
ListHeaderComponent: 顶部组件
```
```
ListFooterComponent: 底部组件
```
```
ListCustomComponent: 自定义显示在顶部视图
```
```
footerViewBottomSpace: 底部视图文字距离底部高度,默认12
```
###  3.属性方法:
```
evaluateView: 赋值当前视图对象
```
```
renderItem: 渲染Cell
```
```
refresh: 下拉刷新数据
  _refresh = (callback) => {
        this.page = 1;
        InfoService.test({'page': this.page, 'count': this.count}).then( (res) => {
            callback({'list': []});
        }).catch( (error) => {

        });

    }
```
```
loadMore: 上拉加载数据
  _loadMore = (callback) => {
        this.page++;
        InfoService.test({'page': this.page, 'count': this.count}).then( (res) => {
            callback({'list': []});
        }).catch( (error) => {

        });

    }
```

###  4.供外部调用的方法:
```
/*
* 直接修改数据源
* */
modifyDataList(list = [])
```
```
/*
* 点击自定义视图刷新数据 1.显示下拉状态，隐藏空视图 2.显示下拉状态，不隐藏空视图
* */
refreshData(type = 1)
```
```
/*
* 修改自定义视图显示状态
* */
modifyCustomComponentStatus(show = false)
```
