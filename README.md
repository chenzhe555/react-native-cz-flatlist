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
