
# react-native-cz-flatlist

## Getting started

`$ npm install react-native-cz-flatlist --save`

### Mostly automatic installation

`$ react-native link react-native-cz-flatlist`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-cz-flatlist` and add `RNCzFlatlist.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNCzFlatlist.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.chenzhe.flatlist.RNCzFlatlistPackage;` to the imports at the top of the file
  - Add `new RNCzFlatlistPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-cz-flatlist'
  	project(':react-native-cz-flatlist').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-cz-flatlist/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-cz-flatlist')
  	```


## Usage
```javascript
import RNCzFlatlist from 'react-native-cz-flatlist';

// TODO: What to do with the module?
RNCzFlatlist;
```
  