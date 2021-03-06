
Pod::Spec.new do |s|
  s.name         = "RNCzFlatlist"
  s.version      = "1.0.0"
  s.summary      = "RNCzFlatlist"
  s.description  = "基于FlatList的下拉刷新，上拉加载更多组件"
  s.homepage     = "https://github.com/chenzhe555/react-native-cz-flatlist"
  s.license      = { :type => "MIT", :file => "LICENSE" }
  s.author       = { "author" => "376811578@qq.com" }
  s.platform     = :ios, "9.0"
  s.source       = { :git => "https://github.com/chenzhe555/react-native-cz-flatlist.git", :tag => s.version }
  s.source_files = "*.{h,m}"
  s.requires_arc = true
  s.dependency "React"
  #s.dependency "others"

end

  