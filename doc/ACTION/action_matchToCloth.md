#컬러 매칭(MC.ACTION.match)
- 상의가 빨간색이면 바지는 뭐입지?
- 바지가 검은색일 때 신발은 뭐신지?
- 빨간색이랑 초록색은 무슨 느낌이야?

#ACTION
<!-- Entity : Cloth 2 + Color 2 -->
<!-- #CID_CLOTH_SRC,DST, CID_COLOR_SRC,DST
빨간색 상의랑 검은색 바지가 잘 어울려?
빨간 상의랑 검은 바지가 어울려?
빨간 상의랑 검은 바지가 어때?
상의 빨간색이랑 바지 검은색이랑 어울려?
상의 빨간색이랑 바지 검은색이랑 어때? -->
@action1 = common action
{
    yes : [
      "네, 걱정하지 않으셔도 되요. 훌륭하답니다.",
      "오늘 옷 좀 센스 있으신데요? 어서 나가보세요.",
      "와,,,<break type="sentence"> 제가 더 이상 알려드릴께 없네요. 완.벽.헿",
      "오늘 컬러 센스 좋으신데요? 바로 나가셔도 되요! 출발~"
    ],
    no : [
      "음... 제 생각에는 <break type="sentence"> {{resultColor}이} 더 잘 어울릴 것 같아요.",
      "{{resultColor}이} 더 나을 것 같아요. 어떠세요?",
      "오늘 저의 추천은...{{resultColor}이} 딱 좋을 것 같아요. 저를 믿어보세요."
    ]
}
<!-- Entity : Color 2 -->
<!-- #CID_COLOR_SRC,DST -->
<!-- 빨간색이랑 초록색은 무슨 느낌이야?
빨간색이랑 초록색은 무슨 톤이야?
빨간색이랑 초록색은 잘 어울려?
빨간색이랑 초록색 매칭 어때?
빨간색이랑 초록색은 잘 매칭돼?
빨간색이랑 초록색 조합 어때? -->
@action2
//query_type == TONE
{
    "",
    "",
    "",
}
//query_type == MATCH
{

}
<!-- Entity : Cloth 2 + Color 1 -->
<!-- #CID_CLOTH_SRC,DST, CID_COLOR_SRC -->
<!-- (1) Cloth with the color -> what colored cloth?
상의가 빨간색이면 바지는 뭐입지?
빨간 상의면 무슨 바지입지?
빨간 상의에 바지는 뭐입지?
빨간 상의랑 무슨 바지가 어울릴까?

(2) what colored cloth -> cloth with the color
어떤 바지가 빨간 상의랑 어울리지?
무슨 색 바지가 빨간 상의랑 어울리지? -->
@action3
{
  "음... 제 생각에는 <break type="sentence"> {{resultColor}이} 더 잘 어울릴 것 같아요.",
  "{{resultColor}이} 더 나을 것 같아요. 어떠세요?",
  "오늘 저의 추천은...{{resultColor}이} 딱 좋을 것 같아요. 저를 믿어보세요."
}
