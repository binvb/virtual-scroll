### 背景

在项目中遇到渲染列表过大，导致页面卡顿问题；找了一下目前虚拟列表的插件，要么性能不佳，要么场景有限不能符合需求，所以考虑自己实现一个虚拟列表滚动的组件；主要是参考谷歌关于无限滚动的文章实现；
目前版本功能和特点如下：  
1 仅支持垂直方向虚拟滚动；  
2 仅支持数据一次性传递到组件;  
3 暂不支持异步渲染(图片，视频等)导致宽高变化的 rerender(异步渲染的 htmlelement 需要监听 dom 变化事件，变化后再更新数据后面的所有数据; #TODO);

### 性能测试结果

demo 测试 5 万条数据在 chrome 下测试结果，基本保持在 60fps，内存消耗在 20m-50m 之间。

### example

yarn && cd example && yarn && yarn serve

### usage

npm i @vb_he/vue-virtual-scroll

### 难点

1 如何计算 item 高度并顺序给每个元素顺序叠加;

```
// 1 顺序通过不显示元素渲染得到item高度后加入到item数据中(通过eventloop事件优先级使用setTimeout计算item渲染后的宽高);
```

2 性能;

```
// 1 首次渲染两屏，滚动过程中渲染过逐渐增加到三屏数据(当前屏幕前后各一屏，当前一屏)，保证当前显示内容始终保持是中间屏数据;
// 2 每次获取到元素宽高后，即更新数据，由框架处理渲染;
// 3 通过脱离文档流postion:absolute进行布局，避免大量重排导致性能下降;
// 4 不做无用的渲染(未得到宽高/位置的元素不渲染到列表数据中)
// 5 通过节流监听浏览器滚动事件;
```

3 滚动任务可能会在未渲染完成之前堆叠导致计算异常，需要通过队列控制渲染顺序;

### 问题记录

1 首屏渲染数据数量；  
暂时考虑在两屏左右，由开发者配置，在不影响性能的前提下初始可以多渲染一些数据；

3 滚动时候加载更多数据的时机；

```
方案1： 监听滚动事件(防抖), 计算已滚动的item数量，补充&回收 dom；
方案2： 监听滚动事件，如果滚动到某个临界值(例如滚动了多少个数据/滚动了一定的距离), 则进行 补充&回收 数据；
```

方案 2 太多定制内容(滚动数据数量变化，临界值处理)，容易出现问题。方案 1 可能会出现性能问题(但考虑到 google 也是用这个方案，并没有出现性能问题)，所以采用方案 2；

4 被回收的数据如何恢复并重新渲染；  
首先数据要保证是完整的，只有 dom 是被回收的，在 dom 上标记一个 index，通过 index 快速查询到需要渲染的数据；

5 如何计算滚动的 item 数量，在滚动后如何计算应该补充哪些数据(上下滚动)， 多少数据？回收多少数据？
设置一个公式，以滚动条位置的 item 为分界，item 上方(上下滚动)显示元素数量为开发者初始渲染数据(后面以 N 替代)的 1/2，下方为 N-1.根据这个公式对数据进行补充/回收。临界状态(初始化上方数据未 0，底部数据无补充)特殊处理。
另， 因为 item 是在变化的，所以补充/回收的操作必须是等数据渲染完毕后进行。

6 如何计算滚动 item 的高度?
通过 item 数据将元素先渲染为不可见元素，渲染后通过 nexttick 获取到宽高。另外需要进行 dom 事件监听(MutationObserve，如果有变化再更新当前显示元素的位置);

### 性能问题记录

1 关于深拷贝；  
一直没留意深拷贝的性能问题，但这次数据量比较大，问题就凸显了。当用 lodash 的 cloneDeep 拷贝一个两万条数据的数组时候(不只是简单类型的数组元素)，耗时大概是 220ms，即使用 JOSN.parse(JSON.stringify())也需要 180ms 左右(称赞下 lodash 优化做的很好了).
之前比较习惯在处理完数据后再赋值给 vue 绑定的数据进行渲染，一个是不用经过多次渲染，一次渲染完成。但其实框架是有自己做优化，例如 vue 某个时间周期内多次数据变化会合并为一次渲染(后面在 vue 文档补充),react 的 setState 合并渲染；但也延伸了另外的问题，e.g.
vue 无法监听到通过下标修改的数组元素变化，只能通过一些 trick 方式来修改，例如修改一个数组元素的时候，通过 splice 方式替换；  
结论是当数据量很大而且对性能要求比较高的时候，尽量不要使用深拷贝。

### 参考

1 Complexities of an Infinite Scroller：https://developers.google.com/web/updates/2016/07/infinite-scroller  
2 react-infinite-scroller： https://github.com/danbovey/react-infinite-scroller  
3 react-infinite-scroll-component: https://github.com/ankeetmaini/react-infinite-scroll-component  
4 动态生成 DOM 元素的高度及行数获取与计算方法： https://segmentfault.com/a/1190000004956121
