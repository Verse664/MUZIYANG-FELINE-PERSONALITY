"use client"

import { useEffect, useRef, useState } from "react"
import BureauIntroSection from "@/components/feline/BureauIntroSection"
import HeroSection from "@/components/feline/HeroSection"
import SpeciesSection from "@/components/feline/SpeciesSection"
import PersonalitySection from "@/components/feline/PersonalitySection"
import SelfConsistentSection from "@/components/feline/SelfConsistentSection"
import EasterEggModal from "@/components/feline/EasterEggModal"
import FilmGrainOverlay from "@/components/feline/FilmGrainOverlay"
import CustomCursor from "@/components/feline/CustomCursor"

// 画布尺寸
const CLOUD_VB_W = 900
const CLOUD_VB_H = 520

type Tier = 0 | 1 | 2

interface FanPhrase {
  text: string
  tier: Tier
  color: string
}

interface PlacedPhrase {
  lines: string[]
  color: string
  fontSize: number
  x: number
  y: number
  left: number
  right: number
  top: number
  bottom: number
}

interface SpotlightState {
  lines: string[]
  color: string
  fontSize: number
  x: number
  y: number
  visible: boolean
}

interface VideoModalState {
  title: string
  subtitle?: string
  description?: string
  videoSrc?: string
  posterSrc?: string
  accent?: string
  variant?: "video" | "letter"
  letterLines?: string[]
  signature?: string
}

// 把 \n 和 <br> / <br/> 统一拆分成多行数组，去除空白行首尾空格
function splitLines(text: string): string[] {
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

// 测量多行文本：宽度取每行最大值，高度按行数 * 行高累加
function measureMultiline(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  fontSize: number
): { width: number; height: number; lineHeight: number } {
  const lineHeight = fontSize * 1.25
  let maxWidth = 0
  for (const line of lines) {
    const w = ctx.measureText(line).width
    if (w > maxWidth) maxWidth = w
  }
  return { width: maxWidth, height: lineHeight * lines.length, lineHeight }
}

// 粉丝留言数据：保留全部原有内容，按长短分三档字号权重
const fanPhrases: FanPhrase[] = [
  { text: "温柔\n——From 云、", tier: 0, color: "#C95573" },
  { text: "奶牛猫！！\n——From Suhedi", tier: 0, color: "#D15D73" },
  { text: "我爱你💕\n——From 一加一", tier: 0, color: "#B24F6B" },
  { text: "感性又性感\n——From 山与", tier: 0, color: "#ffa2bc" },
  { text: "你一定是最棒的\n——From 洋洋", tier: 0, color: "#e37795" },
  { text: "我的精神向导\n——From Kiss the Wind In Night", tier: 0, color: "#B24F6B" },
  { text: "一切美好皆是你\n——From 空白子六六", tier: 0, color: "#D15D73" },
  { text: "爱你是本能\n——From 洋光开朗小女孩", tier: 0, color: "#ffa2bc" },
  { text: "温柔且坚韧 珍视真心\n——From 长庚星", tier: 0, color: "#e37795" },
  { text: "爱上了\n——From HG", tier: 0, color: "#c66a84" },
  { text: "反转魅力，每一面都是魅力\n——From 16mm_nebula tale", tier: 0, color: "#fa99b4" },

  { text: "心思细腻，大大咧咧，感性，大方，傻头傻脑\n——From hi-my.🍟", tier: 1, color: "#D38A96" },
  { text: "鸡毛小雪  猪毛微雪\n——From 树的历险记", tier: 1, color: "#D27B8B" },
  { text: "感性，爱哭，温柔，像春天里温和的春风\n——From 太洋下山还有岳光", tier: 1, color: "#DC7C8F" },
  { text: "真的就是浪漫的文科生吧？\n温柔 包容 敏感 细心 在意情义\n——From 小木好困", tier: 1, color: "#E499A5" },
  { text: "心思细腻 容易内耗\n虽然外表大大咧咧\n——From Ace.of", tier: 1, color: "#D67384" },
  { text: "是你告诉我要好好爱自己再爱你！\n——From 해수 야~~", tier: 1, color: "#D38A96" },
  { text: "木子洋能让我在人生的道路上生出勇气，\n能让我想起他的时候是笑着的\n——From 盐汽水炒饭", tier: 1, color: "#D27B8B" },
  { text: "我那个当明星的沙雕朋友，浪漫疯子\n——From 小图", tier: 1, color: "#DC7C8F" },
  { text: "太阳男孩洋洋\n笑起来很阳光\n——From 一天三杯水", tier: 1, color: "#E499A5" },
  { text: "抽象阳光,活着生命力，\n这都是他身上的活人感,也是我所追随的!\n——From 活在当下只讲屁话", tier: 1, color: "#CB6980" },
  { text: "踩雪 追逐晚霞 喜欢阳光 爱吃美食 \n爱看书 感性 浪漫 温柔 有时傻傻的 \n所有的细节都很打动人\n——From 如果没有明天", tier: 1, color: "#E89AA8" },
  { text: "不想再看你流泪了，哪怕是幸福的眼泪，\n如果一定要跟你的泪水再次相见我希望是在鸟巢。\n——From 小梨真央", tier: 1, color: "#C55B71" },
  { text: "细腻的，温柔的，爱着大家的，\n有时候会忽略自己感受的,特别特别好但是令人心疼的咪\n——From 忆安", tier: 1, color: "#DC7C8F" },
  { text: "大海啊,你真的beautiful。\n还有木子洋笑起来真好看。\n——From baby yu", tier: 1, color: "#E37A8B" },
  { text: "爱意有什么好隐藏的，对啊就是很爱很爱你啊；\n美好,因为有你我愿意去相信这个世界是美好的\n——From 粘手米粒儿~", tier: 1, color: "#EEA0AD" },
  { text: "世界上最最最温柔坚定的木子洋，因为你我愿意更爱世界一点！\n有机会的话让我们多多见面享受在一起的时间,\n没机会的话就祝我们各自安好各自珍重,祝你永远幸福平安。\n——From 山地大野驴", tier: 1, color: "#D67384" },
  { text: "那个在楼上对虐狗人士大喊你干嘛的洋，\n狗毛三级过敏也要撸猫撸狗的洋,\n再苦再累再不舒服也要帮弟弟撑场子的洋最打动人心了\n——From 妞 (๑•́ ₃ •̀๑)妞", tier: 1, color: "#DB7E91" },
  { text: "入坑是 fishboy 的舞台 惊讶到我了 竟然有服务意识这么强的男明星！\n后来越来越喜欢 非常感性 非常曼妙 非常温柔 非常有想法 非常敏感 \n对妹妹们非常好的曼妙男孩！\n他说格莱美也不及妹妹们的心 天呐怎么有如此好的大猫！\n——From 不爱钓鱼🎣", tier: 1, color: "#D98B99" },
  { text: "最喜欢他的笑，不管哪种笑，\n真的太有感染力了,希望他一直这么开心快乐\n(我是个不爱笑的人，但是看小日常每次脸都笑僵了）\n——From yang", tier: 1, color: "#D25976" },
  { text: "我哥哥我爸爸我爱人我老公我主人我daddy\n——From 百鹤语", tier: 1, color: "#D15D73" },
  { text: "感性又温柔的洋洋\n入坑的一瞬间是他这么大方营业而私下里爱看书的反差\n——From 没事儿就爱吃点麻辣烫", tier: 1, color: "#E37A8B" },
  { text: "底色很温柔的一只大猫，\n特别有责任心又带着一些幽默风趣，完全理想型！\n——From 唯唯", tier: 1, color: "#C95573" },
  { text: "高需求大猫！很细腻非常会照顾别人情绪的好宝宝🥰是我姐姐", tier: 1, color: "#D67384" },
  { text: "永远在照顾别人感受的天使 \n希望 木子洋 可以遇到属于自己的木子洋\n——From 吃亿碗", tier: 1, color: "#D98B99" },
  { text: "高需求大猫！\n很细腻非常会照顾别人情绪的好宝宝🥰是我姐姐\n——From 北七Polaris", tier: 1, color: "#D8A7B1" },
  { text: "妹妹，开心是最富有的事情了妹妹\n——From 小木好困", tier: 1, color: "#C86A84" },
  { text: "你像夏日的阳光般热烈盛放，冬日又化成温润的暖阳温暖心房，\n你的放声开怀,我随声而笑,我们一直都在。\n——From rui词芳~", tier: 1, color: "#ffcddb" },
  { text: "新粉 被他大方的薄肌吸引过来的 \n了解他的性格更喜欢了 很治愈\n——From momo", tier: 1, color: "#D38A96" },
  { text: "很温暖又浪漫的存在～\n感觉有他世界很美好\n——From 沫沫🐑", tier: 1, color: "#f9a7b5" },
  { text: "看到了另一个自己\n—���From 爱吃肘子的万能人", tier: 1, color: "#ad4d5d" },
  { text: "窗外的暴雨淋不湿屋内的你，我是暴雨，你还是你\n——From 风眷叙", tier: 1, color: "#e28191" },
  { text: "温柔，拥有感受爱并给予爱的能力的好猫一只\n——From 张麦麦", tier: 1, color: "#b74c5e" },
  { text: "爱他耍宝，爱他笑起来的样子，\n爱他黏黏糊糊的嗓音,\n爱他活泼表象下可以窥见的温柔。\n——From Hehe", tier: 1, color: "#f77288" },
  { text: "希望哥哥能多照顾照顾自己,\n少生病,多笑笑,别再哭了。\n——From Hehe", tier: 1, color: "#e28191" },
  { text: "他是个心思很细腻的大猫🐱，私底下温温柔柔安安静静的咪\n——From 小月亮🌙", tier: 1, color: "#ffa9b8" },
  { text: "特别萌 特别真诚的一个洋咪 \n木子洋做自己就是最棒的!我保证木子洋是天使!\n——From Cindy望聆忻.", tier: 1, color: "#d492a5" },
  { text: "细腻 感觉他跟我很像，\n内心其实很敏感,很能感知外界情绪\n——From Scream", tier: 1, color: "#ff9cb8" },
  { text: "很感性很温暖，喜欢耍宝但是也很会照顾人\n——From glmm", tier: 1, color: "#ffbdd0" },
  { text: "真诚细腻又温柔的一个男生，教会我更好的去爱人。\n——From 咩咩坨_Elowen", tier: 1, color: "#f45b86" },
  { text: "虽然常常可惜没有早点能遇见，但依然庆幸我们还是遇见了\n——From 都会好的", tier: 1, color: "#efbdcb" },

  { text: "外表高冷有距离感，实则底色温柔又温暖，\n强烈的反差感对我来说有着致命吸引力\n——From +0", tier: 2, color: "#F3DFE2" },
  { text: "我想对洋洋说：\n请继续做个浪漫的疯子吧,请继续笑着爱这个世界吧，\n首先你要快乐,其次都是其次！\n——From 卡拉", tier: 2, color: "#F5E7E9" },
  { text: "笑起来就是大猫超级可爱，还会撒娇，\n不笑的时候很稳重能抗事,真的像大哥一样\n——From 柳柳", tier: 2, color: "#f8c1cd" },
  { text: "第一次线下的结束语：\n如果有机会,我们就来见一次面吧,\n因为没有任何时候是比当下最好的时刻。\n我不想你们错过当下最好时刻绽放的我们,\n我们也不想错过当下对我们感情最浓烈最美好和最漂亮的你，\n所以有时间和我们一起来约会吧~~\n——From 腊肉肉肉", tier: 2, color: "#D76176" },
  { text: "站舞台上的木子洋一直在散发很独特的魅力，\n而且能很清晰的感知到,他的唱功和舞蹈还一直在默默用功进步，\n从杭州到海口场的高音长音等处理越来越扎实越来越稳,喜欢他很安心\n——From 南卡南卡", tier: 2, color: "#CB6980" },
  { text: "很细腻的一个大哥哥，还会照顾身边人的情绪，\n也很会活跃气氛!是个高需求宝宝!\n工作时候私下安静看书,会冥想/合理健身！像小猫一样喜欢睡觉！\n——From 肉肉不知", tier: 2, color: "#E794A0" },
  { text: "在这一瞬间我脑海里浮现的是\n六巡首场杭州场谢幕时候和妹妹们一起流泪了的大猫\n——From 宛若梦未央", tier: 2, color: "#C96E82" },
  { text: "一个特别温暖 温柔细腻的大男孩 \n是一个很会活跃气氛的人 又很会安慰人 \n说话黏黏糊糊的特可爱 有他在的地方永远都不会冷场 \n希望洋洋永远都可以笑哈哈的 不要被那些坏评论坏人影响了心情 永远做自己！\n木子洋全 肯定呐！\n——From 聪聪洋", tier: 2, color: "#edb3bc" },
  { text: "去年苏州音乐节是oner在汽水的最后一场(不知道有没有记错),\n汽水喷的彩带上很用心,有oner的歌还是歌词,还特别感谢了oner这一年陪汽水走了很多地方!\n洋洋发现后马上收起嘻嘻哈哈认真的感谢了小汽水!看视频才能感受到当时的真诚!可能我的语言比较匮乏!\n当时我就觉得,洋洋真的是一个很细腻温柔,能接住所有真诚和善意的人!\n——From Olivia yang", tier: 2, color: "#ff9cac" },
  { text: "一个阳光明媚的男孩,本来自己也是i人,为了活跃气氛硬生生把自己变成e人,\n很有担当也很有责任感,可以把弟弟们护在身后，\n每次说话都是黏黏糊糊的,很可爱,谁懂他那嗓子,还是一个爱撒娇的男孩，\n很喜欢听他撒娇,露身材也是大大方方的,我的男孩不扭捏不做作\n——From 樱桃杀手头号粉", tier: 2, color: "#DB7E91" },
  { text: "可以陪我玩的年上，可靠阳光拯救我的，\n第一次见是音乐节 当时我不认识他 只觉得他声音特别好听 \n第一印象远远高于妈妈和小弟 觉得他特别明媚 \n于是第二次音乐节见了之后 他就成为了我的本命\n——From 美刀不吃xuannn", tier: 2, color: "#e68895" },
  { text: "我们的第一次见面是在25年的8月2号,\n也是这一场你的帅气松弛把我吸引进了万能星球,\n认识到你的细腻,你爱着这个团队,认真对待每个舞台,\n木子洋你值得我们的爱,一直会有人爱你！\n——From xx不嘻嘻", tier: 2, color: "#ffc8cd" },
  { text: "第一次见到他是他金边眼镜的小红书，真正爱上是北京场的黑西装，\n每次见到他不同的造型都会想怎么会有人那么帅那么可爱,\n再深入了解发现他很像报喜不报忧的小孩,嘻嘻哈哈的外表下隐藏着细腻的柔软的内心。\n希望他身心健康,希望他下次放粉丝进群是因为开心,希望他明媚开心做自己。\n——From '、", tier: 2, color: "#ff8698" },
  { text: "私下喜欢安静，用独处来恢复能量，但是不耽误他喜欢和亲近的人待在一起，\n很内敛,感觉是会不好意思表达对别人的爱的那种，会为了团体发展去社交和付出\n(没有说感觉他在委屈自己的意思，只要是 木子洋 选择干的我都无条件支持),\n很有责任心,在公众面前会给大家带来正向的情绪价值。\n咪好,咪的细腻、温柔、安静、开朗和锅碗瓢盆旧家电我照单全收，\n只要是洋哥选择做的我全都支持,相信洋哥已经平衡好了木子洋和李振洋,\n所以洋哥做什么我都相信他是发自内心的想去做,不管是木子洋还是李振洋都是他自己\n——From ZXA", tier: 2, color: "#f09ea5" },
  { text: "我发现不管别人多么好,\n你始终都是我的首选,\n我的心永远偏向你,\n我的生命中第一次出现你这样与我如此适配的人\n——From 一城天", tier: 2, color: "#f0adb7" },
  { text: "愛意有什麼好隱藏的！\n一開始沒有get到洋哥,直到第一次線下以及考古了許多物料後，\n發現他真的是很細膩敏感的人,每次在玩笑的口吻說出關懷的話，照顧著大家的情緒。\n漸漸愛上這個暖呼呼的人!\n當然大模Daddy 的時候也是帥到不行！ 這種反差感實在太萌了\n——From Nadear Hsu", tier: 2, color: "#bc657e" },
  { text: "在过去的一年爱上你让我感觉好幸福，\n也希望你被更多更多的人爱,收获更多的幸福！\n——From 拐洞洞拐", tier: 2, color: "#ee4575" },
  { text: "你本来就是个很好的人，\n真诚细腻、开朗嬉笑的你,\n总能照顾好身边所有人情绪的你,\n不让话掉地上的你,\n总会串联好方方面面细节的你,\n我们总能从你身上能汲取能量,也会从你身上映衬着生活中的自己,\n深知“顾全”二字要做到、有多难。\n木子洋 ，希望你始终向阳，永远自由，健康快乐！\n如果有机会,就见一次面吧!\n——From 飞天小神猪gy", tier: 1, color: "#D38A96" },
  { text: "不相信别人的漂亮话，但非常相信我洋洋哥哥的真心，\n他说“格莱美 也不����妹们的心”，\n觉得他太美好了,洋洋是天使！\n——From 丘丘Joice", tier: 2, color: "#ff9cb8" },
  { text: "“只要咱们饿前面就有吃的，只要咱们出去玩就得有大太阳”\n历���千帆依然相信世界是美好的,勇于享受生活热爱生活，\n喜欢去安静的海岛旅行喜欢吃各种各样的美食,\n他的世界很丰富多彩也会影响身边的人,\n是个很会治愈别人的小太阳\n——From Екатерина", tier: 2, color: "#ce91a2" },
  { text: "最喜欢的其实是哥哥柔软的心❤️从一开始到八年后的现在，\n不管世界怎么变,人又怎么成长和成熟,\n唯一不改的是木子洋温柔善良的底色。\n——From noliquid鱼鱼🍓", tier: 2, color: "#ff9cb8" },
  { text: "总是幽默诙谐的语气去描述一切，带给身边的人好多欢乐的阳光大男孩。\n特别喜欢他笑起来的样子,萌萌的微笑和搞怪的时候的哈哈大笑。\n很多次生气的时候看见他的笑容真的能秒治愈,\n很适用那句“他一笑就想把全世界都给他”\n——From 幸运的夕兮", tier: 2, color: "#d4587b" },
  { text: "感性 温柔 浪漫 幽默 也很有自己对生活的看法和态度,\n某些地方和我有点相似但是又有很多我希望拥有的优点,希望洋洋健康快乐!\n(私以为run和 迷走神经 这两首歌很符合他本人气质）\n——From 维持生命元素", tier: 2, color: "#d492a5" },
  { text: "和我一样爱吃西红柿鸡蛋\n和我一样到了新城市喜欢先闻它的味道\n表面开朗内心细腻永远优先照顾别人情绪\n希望洋洋能天天开心\n——From 等天黑", tier: 2, color: "#ff9cb8" },
  { text: "木子洋，一个热闹开朗，逗趣耍宝的洋,\n看似大大咧咧的外壳下,藏着一颗敏感细腻又温柔的心～\n愿有人读懂你的柔软,\n愿你一直被爱意包围,\n愿你随心生活\n永远自在喜乐。\n——From in-joysun-sun", tier: 2, color: "#f0becc" },
  { text: "感觉在于一些理想主义什么的？\n其实对他们三个都挺佩服，\n但是最注意到他的是他们感同身受的那个舞台他哭了，\n以前一直以为舞台必须是完美的，但他哭到哽咽真的很触动我，\n感觉到了一些灵魂的共鸣，可以感受到他是真的爱舞台，\n加上自己身处的环境身边的人好像都没什么理想，\n但我真的是会为了梦想而痛哭的人，所以会很被吸引\n——From 暮芫", tier: 2, color: "#c7607d" },
  { text: "喜欢平时闹腾抽风搞笑的样子，也喜欢私底下安静细腻温柔敏感的样子。\n不隐藏的爱意，埋藏心底的委屈，感性的瞬间，自律养生的日常。\n像一位通透的入世者，清醒但不世俗，\n总之 木子洋全 肯定。\n——From 聊待", tier: 2, color: "#f45b86" },
  { text: "很温柔细腻的人，总是能顾及到身边的人，把身边人照顾的很好，\n巡演南京场的时候抽扭蛋玩游戏轮到另外两人给他出题,\n他就带着大家玩应援棒完全没有冷场，\n有他在总是感觉很安心,希望 木子洋 的身边也有一个木子洋。\n虽然大家都说他私下里很安静话少,但是他还是愿意为了粉丝搞氛围做效果逗大家开心！\n而且他不笑的时候就帅帅酷酷的,笑起来就萌萌的,不论是性格还是长相都是很有魅力的一枚！\n——From 🐟️都被海风吹走了吧", tier: 2, color: "#E78695" },
]

// 各字号档位的取值范围（背景层用，偏小偏淡）
const TIER_SIZE_RANGE: Record<Tier, [number, number]> = {
  0: [24, 30],
  1: [16, 21],
  2: [11, 14],
}

// 聚光主体色板：只用中深色调，保证在浅粉背景下始终清晰可辨（浅色只留给背景层用）
const SPOTLIGHT_COLORS = [
  "#B24F6B",
  "#C95573",
  "#D15D73",
  "#C55B71",
  "#CB6980",
  "#D67384",
  "#D25976",
  "#C96E82",
]

// 聚光主体字号范围（比背景层大一些，作为视觉焦点；多行文本会自动略缩小，见下方逻辑）
const SPOTLIGHT_SIZE_RANGE: [number, number] = [30, 44]

function randInRange([min, max]: [number, number]): number {
  return min + Math.random() * (max - min)
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function FelineArchivePage() {
  const [videoModal, setVideoModal] = useState<VideoModalState | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [cloudLayout, setCloudLayout] = useState<PlacedPhrase[]>([])
  const [spotlight, setSpotlight] = useState<SpotlightState | null>(null)
  const measureCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const fontFamilyRef = useRef<string>("sans-serif")

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view")
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    )
    const elements = document.querySelectorAll(".reveal")
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // 背景文字云：静态铺开一次，作为氛围底纹，低透明度显示（支持多行）
  useEffect(() => {
    let cancelled = false

    async function computeLayout() {
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready
        } catch {
          // 忽略字体加载检测失败
        }
      }
      if (cancelled) return

      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const rootStyles = getComputedStyle(document.documentElement)
      const fontFamily =
        rootStyles.getPropertyValue("--font-sans").trim() || "sans-serif"

      measureCtxRef.current = ctx
      fontFamilyRef.current = fontFamily

      const ordered = [...fanPhrases].sort((a, b) => a.tier - b.tier)
      const placed: PlacedPhrase[] = []
      const cx = CLOUD_VB_W / 2
      const cy = CLOUD_VB_H / 2
      const maxRadius = Math.hypot(CLOUD_VB_W, CLOUD_VB_H)

      for (const phrase of ordered) {
        const lines = splitLines(phrase.text)
        if (lines.length === 0) continue

        const fontSize = randInRange(TIER_SIZE_RANGE[phrase.tier])
        ctx.font = `${fontSize}px ${fontFamily}`
        const { width, height } = measureMultiline(ctx, lines, fontSize)
        const halfW = width / 2
        const halfH = height / 2

        let found: { x: number; y: number; left: number; right: number; top: number; bottom: number } | null = null
        const radiusStep = 5
        const angleStep = 0.28

        for (let r = 0; r < maxRadius && !found; r += radiusStep) {
          for (let a = 0; a < Math.PI * 2 && !found; a += angleStep) {
            const x = cx + r * Math.cos(a)
            const y = cy + r * Math.sin(a) * 0.62

            const left = x - halfW
            const right = x + halfW
            const top = y - halfH
            const bottom = y + halfH

            if (left < 6 || right > CLOUD_VB_W - 6 || top < 6 || bottom > CLOUD_VB_H - 6) {
              continue
            }

            const pad = 3
            let overlap = false
            for (const p of placed) {
              if (
                !(right + pad < p.left ||
                  left - pad > p.right ||
                  bottom + pad < p.top ||
                  top - pad > p.bottom)
              ) {
                overlap = true
                break
              }
            }
            if (overlap) continue

            found = { x, y, left, right, top, bottom }
          }
        }

        if (found) {
          placed.push({
            lines,
            color: phrase.color,
            fontSize,
            x: found.x,
            y: found.y,
            left: found.left,
            right: found.right,
            top: found.top,
            bottom: found.bottom,
          })
        }
      }

      if (!cancelled) setCloudLayout(placed)
    }

    computeLayout()
    return () => {
      cancelled = true
    }
  }, [])

  // 聚光轮播：每次一段留言作为主体，淡入 → 停留 → 淡出 → 换下一句 + 换位置（支持多行）
  useEffect(() => {
    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout>

    const FADE_IN_MS = 900
    const HOLD_MS = 2600
    const FADE_OUT_MS = 900
    const GAP_MS = 250

    let queue = shuffle(fanPhrases)
    let queueIndex = 0

    function pickPosition(lines: string[], fontSize: number) {
      const ctx = measureCtxRef.current
      const fontFamily = fontFamilyRef.current
      if (!ctx) return { x: CLOUD_VB_W / 2, y: CLOUD_VB_H / 2 }

      ctx.font = `${fontSize}px ${fontFamily}`
      const { width, height } = measureMultiline(ctx, lines, fontSize)
      const halfW = width / 2
      const halfH = height / 2

      const margin = 24
      const minX = margin + halfW
      const maxX = CLOUD_VB_W - margin - halfW
      const minY = margin + halfH
      const maxY = CLOUD_VB_H - margin - halfH

      if (minX >= maxX || minY >= maxY) {
        return { x: CLOUD_VB_W / 2, y: CLOUD_VB_H / 2 }
      }

      const x = randInRange([minX, maxX])
      const y = randInRange([minY, maxY])
      return { x, y }
    }

    function scheduleNext() {
      if (cancelled) return

      if (queueIndex >= queue.length) {
        queue = shuffle(fanPhrases)
        queueIndex = 0
      }
      const phrase = queue[queueIndex]
      queueIndex += 1

      const lines = splitLines(phrase.text)
      if (lines.length === 0) {
        scheduleNext()
        return
      }

      // 行数越多，自动适当缩小字号，避免多行长文本超出画布或过于抢眼
      const baseFontSize = randInRange(SPOTLIGHT_SIZE_RANGE)
      const fontSize = lines.length > 1 ? baseFontSize * (1 - 0.12 * (lines.length - 1)) : baseFontSize
      const clampedFontSize = Math.max(20, fontSize)

      const color = SPOTLIGHT_COLORS[Math.floor(Math.random() * SPOTLIGHT_COLORS.length)]
      const { x, y } = pickPosition(lines, clampedFontSize)

      setSpotlight({ lines, color, fontSize: clampedFontSize, x, y, visible: false })
      timeoutId = setTimeout(() => {
        if (cancelled) return
        setSpotlight((prev) => (prev ? { ...prev, visible: true } : prev))

        timeoutId = setTimeout(() => {
          if (cancelled) return
          setSpotlight((prev) => (prev ? { ...prev, visible: false } : prev))

          timeoutId = setTimeout(() => {
            if (cancelled) return
            scheduleNext()
          }, FADE_OUT_MS + GAP_MS)
        }, HOLD_MS)
      }, 30)
    }

    const startDelay = setTimeout(() => {
      scheduleNext()
    }, 400)

    return () => {
      cancelled = true
      clearTimeout(startDelay)
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <>
      <CustomCursor />
      <FilmGrainOverlay />
      <main
        className="relative min-h-screen overflow-x-hidden"
        style={{ fontFamily: "var(--font-sans), sans-serif", backgroundColor: "#FAF7F5" }}
      >
        <BureauIntroSection />
        <HeroSection onEggTrigger={() => setVideoModal({
          title: "情报局 · 深层档案解密",
          subtitle: "CLASSIFIED INTEL VIDEO",
          description: "情报局猫探长专属寄语，点击即可解锁深层情报。",
          videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          posterSrc: "/KWINmanmiao.jpg",
          accent: "#D4AF37",
        })} scrollY={scrollY} />
        <SpeciesSection />
        <PersonalitySection
        onOpenVideo={(personality) =>
          setVideoModal({
            title: personality.videoTitle,
            subtitle: "VIDEO EXHIBIT",
            description: personality.videoDescription,
            videoSrc: personality.videoSrc,
            posterSrc: personality.posterSrc,
            accent: personality.accent,
          })
        }
      />
        <SelfConsistentSection onEggTrigger={() => setVideoModal({
          title: "情报局 · 归档深层情报",
          subtitle: "SEALED LETTER · 火漆密信",
          accent: "#D4AF37",
          variant: "letter",
          letterLines: [
            "如果你看到这里，说明五份卷宗你都翻完了。",
            "谢谢你愿意花这些时间，认真地认识一遍「洋洋」。",
            "曼妙、温柔、捣蛋、担当、傲娇——",
            "其实哪一面都不是刻意扮演的角色，",
            "只是不同的时刻，恰好露出了不同的自己。",
            "谢谢你没有只选一面来定义我，",
            "谢谢你愿意把五份都看完。",
            "以后的路还很长，",
            "希望你还愿意继续陪着看下去。",
          ],
          signature: "MuZiyang · 木子洋",
        })} />

        <section className="relative overflow-hidden py-32 px-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 18% 14%, rgba(245,232,236,0.48) 0%, transparent 18%), radial-gradient(circle at 79% 28%, rgba(247,236,233,0.38) 0%, transparent 16%), radial-gradient(circle at 48% 76%, rgba(255,245,244,0.5) 0%, transparent 20%), linear-gradient(180deg, rgba(250,247,245,1) 0%, rgba(250,242,240,1) 100%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: "repeating-linear-gradient(135deg, transparent 0 8px, rgba(230,212,215,0.18) 8px 9px)" }} />
          <div className="fan-messages-petal absolute left-8 top-16 h-16 w-16 rounded-full bg-[#F5E5E6]/80 blur-sm" />
          <div className="fan-messages-petal absolute right-12 top-32 h-20 w-20 rounded-full bg-[#F8E6E9]/80 blur-sm" />

          <div className="relative mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <div className="mb-4 flex items-center justify-center gap-4">
                <span style={{ flex: 1, maxWidth: 60, height: "0.5px", background: "linear-gradient(90deg, transparent, #D4AF37)", opacity: 0.4 }} />
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.58rem",
                    letterSpacing: "0.4em",
                    color: "#D4AF37",
                  }}
                >
                  BUREAU FILE · 04
                </span>
                <span style={{ flex: 1, maxWidth: 60, height: "0.5px", background: "linear-gradient(90deg, #D4AF37, transparent)", opacity: 0.4 }} />
              </div>
              <p
                className="mb-5 font-sans text-[0.72rem] uppercase tracking-[0.45em]"
                style={{ letterSpacing: "0.35em", color: "#8E8E93" }}
              >
                INTEL EXCHANGE · OPEN TRANSMISSION
              </p>
              <h2
                className="font-serif mx-auto max-w-xl text-[clamp(2rem,4vw,3.8rem)] leading-tight"
                style={{ color: "#1C1C1E", letterSpacing: "0.04em" }}
              >
                情报交换区
              </h2>
              <p
                className="mt-3"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.2em",
                  color: "#8E8E93",
                  lineHeight: 1.8,
                }}
              >
                无限流情报在此汇聚 · 侦探们的一手线报持续更新
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-5xl border border-[#D4AF37]/25 bg-[#FDFAF4]/80 px-8 py-12 shadow-[0_8px_60px_rgba(212,175,55,0.08)]" style={{ backdropFilter: "blur(8px)" }}>
              {/* 情报卷宗顶部机密条 */}
              <div
                className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-1.5"
                style={{
                  backgroundColor: "#1C1C1E",
                  borderBottom: "1px solid rgba(212,175,55,0.4)",
                }}
              >
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.45rem", letterSpacing: "0.4em", color: "#D4AF37" }}>
                  [ INTEL EXCHANGE · 情报交换 ]
                </span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.45rem", letterSpacing: "0.3em", color: "#8E8E93" }}>
                  LIVE TRANSMISSION · {(new Date()).getFullYear()}
                </span>
              </div>
              <div style={{ marginTop: "2rem" }}>
              <div className="mx-auto w-full overflow-hidden" style={{ aspectRatio: `${CLOUD_VB_W} / ${CLOUD_VB_H}` }}>
                <svg
                  viewBox={`0 0 ${CLOUD_VB_W} ${CLOUD_VB_H}`}
                  className="h-full w-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* 背景文字云：淡淡的氛围底纹，始终存在，支持多行 */}
                  <g opacity={0.22}>
                    {cloudLayout.map((item, index) => {
                      const lineHeight = item.fontSize * 1.25
                      const startOffset = -((item.lines.length - 1) / 2) * lineHeight
                      return (
                        <text
                          key={index}
                          x={item.x}
                          fontSize={item.fontSize}
                          fill={item.color}
                          fontFamily="var(--font-sans), sans-serif"
                          textAnchor="middle"
                        >
                          {item.lines.map((line, lineIdx) => (
                            <tspan
                              key={lineIdx}
                              x={item.x}
                              y={item.y + startOffset + lineIdx * lineHeight}
                            >
                              {line}
                            </tspan>
                          ))}
                        </text>
                      )
                    })}
                  </g>

                  {/* 聚光主体：轮播淡入淡出，支持多行 */}
                  {spotlight && (() => {
                    const lineHeight = spotlight.fontSize * 1.25
                    const startOffset = -((spotlight.lines.length - 1) / 2) * lineHeight
                    return (
                      <text
                        x={spotlight.x}
                        fontSize={spotlight.fontSize}
                        fill={spotlight.color}
                        fontFamily="var(--font-sans), sans-serif"
                        fontWeight={600}
                        textAnchor="middle"
                        style={{
                          opacity: spotlight.visible ? 1 : 0,
                          transition: "opacity 0.9s ease, transform 0.9s ease",
                          transform: spotlight.visible ? "scale(1)" : "scale(0.94)",
                          transformOrigin: `${spotlight.x}px ${spotlight.y}px`,
                        }}
                      >
                        {spotlight.lines.map((line, lineIdx) => (
                          <tspan
                            key={lineIdx}
                            x={spotlight.x}
                            y={spotlight.y + startOffset + lineIdx * lineHeight}
                          >
                            {line}
                          </tspan>
                        ))}
                      </text>
                    )
                  })()}
                </svg>
              </div>
              </div>{/* end marginTop wrapper */}
            </div>
          </div>
        </section>
      </main>

      <EasterEggModal
        open={Boolean(videoModal)}
        onClose={() => setVideoModal(null)}
        title={videoModal?.title}
        subtitle={videoModal?.subtitle}
        description={videoModal?.description}
        videoSrc={videoModal?.videoSrc}
        posterSrc={videoModal?.posterSrc}
        accent={videoModal?.accent}
        variant={videoModal?.variant ?? "video"}
        letterLines={videoModal?.letterLines}
        signature={videoModal?.signature}
      />

      <style jsx global>{`
        * { cursor: none !important; }

        .reveal {
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .reveal.delay-1 { transition-delay: 0.1s; }
        .reveal.delay-2 { transition-delay: 0.22s; }
        .reveal.delay-3 { transition-delay: 0.38s; }
        .reveal.delay-4 { transition-delay: 0.52s; }
        .reveal.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        .handwrite-reveal {
          opacity: 0;
          transition: opacity 1.2s ease;
        }
        .handwrite-reveal.in-view {
          opacity: 1;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #FAF7F5; }
        ::-webkit-scrollbar-thumb { background: #D8A7B1; border-radius: 2px; }

        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -3%); }
          20% { transform: translate(2%, 3%); }
          30% { transform: translate(-1%, 2%); }
          40% { transform: translate(3%, -1%); }
          50% { transform: translate(-3%, 1%); }
          60% { transform: translate(1%, -2%); }
          70% { transform: translate(-2%, 3%); }
          80% { transform: translate(2%, -3%); }
          90% { transform: translate(-1%, 1%); }
        }

        @keyframes blink {
          0%, 85%, 100% { transform: scaleY(1); }
          90%, 92% { transform: scaleY(0.05); }
        }

        @keyframes pupil-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.72); }
        }

        @keyframes float-petal {
          0% { opacity: 0; transform: translateY(-20px) rotate(0deg); }
          10% { opacity: 0.6; }
          90% { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(110vh) rotate(720deg); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }

        @keyframes stamp-in {
          0% { opacity: 0; transform: scale(1.4) rotate(-8deg); }
          60% { opacity: 1; transform: scale(0.95) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        .stamp-animate {
          animation: stamp-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .text-cursor::after {
          content: '|';
          animation: cursor-blink 1s step-end infinite;
          color: #D8A7B1;
        }

        .fan-messages-petal {
          animation: float-petal 14s linear infinite;
        }

        .fan-messages-petal:nth-child(1) {
          animation-delay: 0s;
          transform: translate(0, 0) rotate(-15deg);
        }

        .fan-messages-petal:nth-child(2) {
          animation-delay: 4s;
          transform: translate(0, 0) rotate(12deg);
        }
      `}</style>
    </>
  )
}
