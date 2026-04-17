// 100 soruluk varsayılan deste (kategorili)
// Arkadaş ortamı için: kızıştırıcı, aşk, utanç, derin, sosyal, eğlenceli

export type Category =
  | "kizistirici"
  | "ask"
  | "utanc"
  | "derin"
  | "sosyal"
  | "eglenceli";

export type Question = { text: string; category: Category };

export const CATEGORIES: { key: Category; label: string; emoji: string }[] = [
  { key: "kizistirici", label: "Kızıştırıcı", emoji: "🔥" },
  { key: "ask", label: "Aşk & Flört", emoji: "💘" },
  { key: "utanc", label: "Utanç", emoji: "😳" },
  { key: "derin", label: "Derin", emoji: "🌊" },
  { key: "sosyal", label: "Sosyal", emoji: "👀" },
  { key: "eglenceli", label: "Eğlenceli", emoji: "🎉" },
];

export const CATEGORY_LABEL: Record<Category, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.label])
) as Record<Category, string>;

const k = (text: string): Question => ({ text, category: "kizistirici" });
const a = (text: string): Question => ({ text, category: "ask" });
const u = (text: string): Question => ({ text, category: "utanc" });
const d = (text: string): Question => ({ text, category: "derin" });
const s = (text: string): Question => ({ text, category: "sosyal" });
const e = (text: string): Question => ({ text, category: "eglenceli" });

export const DEFAULT_QUESTIONS: Question[] = [
  // Kızıştırıcı / karşılaştırma
  k("Bu ortamdaki en seksi kim? İsim ver."),
  k("Bu ortamdaki en güzel/yakışıklı kim? İsim ver."),
  k("Bu ortamdaki en çirkin kim? Yuvarlama, isim ver."),
  k("Gruptaki en dramatik kim?"),
  k("Gruptaki en cimri kim?"),
  k("Gruptaki en yalancı kim?"),
  k("Gruptaki en dedikoducu kim?"),
  k("Gruptaki en tembel kim?"),
  k("Gruptaki en çapkın kim?"),
  k("Gruptaki en bencil kim?"),
  k("Gruptaki en sahte kim?"),
  k("Gruptaki en şımarık kim?"),
  k("Gruptaki en iyi giyinen kim?"),
  k("Gruptaki en kötü giyinen kim?"),
  k("Gruptaki en kötü şoför kim?"),
  k("Grubun annesi/babası gibi davranan kim?"),
  k("Masadan biri reality show'a çıksa kim yırtar?"),
  k("Masadan en iyi öpüşen kim sence? Tahmin yap."),
  k("Masadan en kötü öpüşen kim sence? Tahmin yap."),
  k("Senden açık ara daha başarılı olacağını düşündüğün grup üyesi kim?"),
  k("Masadan kiminle tek gecelik yaşardın? Bugün değil, hayatında bir an."),
  k("Masadan yatakta en vahşi kim olur sence?"),
  k("Masadan en tutuk, en beceriksiz kim olur sence?"),
  k("Masadan kim en çok insanla yatmıştır sence? Tahmin yap."),
  k("Masadan kim hâlâ bakir/bakire olabilir sence?"),
  k("Masadan kimin en büyük sırrı cinsel bir şeydir sence?"),
  k("Masadan kim sana asılsa pas geçmezdin?"),
  k("Masadan kimi sarhoşken öpebilirdin, kabul et."),
  k("Masadan kim sevgilisini rahatça aldatır sence?"),
  k("Masadan kimi çıplak görmek en çok şok ederdi?"),
  k("Masadan en çok hangisi 'aç gözlü' sence — duygusal mı, fiziksel mi?"),
  k("Masadan kimle üçlü teklifi alsan 'belki' derdin? Sadece isim."),
  k("Masadan kim en iyi vücuda sahip sence? Yüze bakma."),
  k("Masadan kim dating uygulamasında eşleşsen swipe atmadan geçmezdin?"),
  k("Masadan kim en manipülatif — duygusal ilişkilerde?"),
  k("Masada senin eski sevgilinle yatmış olma ihtimali olan biri var mı? Kim olabilir?"),

  // Aşk / flört / ilişki
  a("En son kime aşık olup söyleyemedin?"),
  a("Gruptan birine hiç sempati duydun mu? Sadece evet/hayır."),
  a("Şu an odada olmayan bir eksinle gruptakiler tanışsa nasıl tepki verirdin?"),
  a("Hiç aldattığın biri oldu mu?"),
  a("Şu anki partnerin dışında, masada biriyle olsan kim olurdu?"),
  a("En son ne zaman birini öptün?"),
  a("En utanç verici flört deneyimin neydi?"),
  a("İlk aşkının ismini söyle."),
  a("Hâlâ takip ettiğin bir ex var mı? Neden?"),
  a("Instagram DM'de en son kiminle konuştun? Aç göster."),
  a("Hayalindeki kişi bugün kapıda belirse ne yapardın?"),
  a("Birine karşı söyleyemediğin bir şey var mı şu an?"),
  a("Tek taraflı sevdiğin biri var mı şu an? Sadece evet/hayır."),
  a("Okul yıllarında seni en çok gıcık eden kişi kimdi, neden?"),
  a("Hiç birine yanlışlıkla 'seni seviyorum' dedin mi?"),
  a("Kaç kişiyle yattın bugüne kadar? Gerçek sayı."),
  a("Kaç kişiyle öpüştün hayatında? Hatırladığın kadarıyla."),
  a("En son ne zaman seks yaptın? Kiminle?"),
  a("En kısa ilişkin kaç saat sürdü?"),
  a("Hiç tek gecelik yaşadın mı? Kaç kere?"),
  a("İlk seks deneyimini anlat — nerede, nasıl?"),
  a("Partnerini aldattın mı hiç? Kiminle ve neden?"),
  a("Hiç aldatıldın mı? Öğrendiğinde ne yaptın?"),
  a("Birinin partneriyle yazıştığın oldu mu? Gizli."),
  a("Şu an bile sexting attığın biri var mı? Adını söyle."),
  a("En son kime şehvet dolu bir mesaj attın?"),
  a("Birinin partneriyle öpüşseydin, masada kimi seçerdin?"),
  a("En tuhaf cinsel fantezin ne? Söyle."),
  a("Hiç yasak ilişki yaşadın mı? Evli biriyle, arkadaşının eski sevgilisiyle vs."),
  a("Bir gecede aynı kişiyle en fazla kaç kere yaptın?"),
  a("Hayatında 'asla kimseye söylemem' dediğin cinsel deneyim hangisi?"),
  a("Partnerin dışında birini düşünerek kendini avuttuğun oldu mu? Kimdi?"),
  a("Ekstra biriyle flört ettiğini sevgilin öğrenseydi ilişkin biterdi — öyle biri oldu mu?"),
  a("Telefon galerinde sevgilin görmemeli olan bir şey var mı?"),
  a("Bir ex'ine hâlâ 'istesen geri dönerim' der miydin? Kim?"),
  a("Birini düşünerek rüya görmüşlüğün oldu mu? Masadaki biri olabilir mi?"),
  a("Grup içinde hiç başka biriyle gizli öpüştün mü? Kiminle?"),
  a("Hiç birini kıskançlıktan çıldırttın mı — kasten? Nasıl?"),

  // Utandırıcı / itiraf
  u("Son 1 yılda yaptığın en utanç verici şey neydi?"),
  u("Alkolün etkisiyle yaptığın en büyük rezillik?"),
  u("Büyüklerinin yanında yaşadığın en rezil an?"),
  u("Çocukken inandığın en saçma şey?"),
  u("Birinin yanında düştüğün en beter an?"),
  u("Annen/baban odana habersiz girseydi bugün ne görürdü?"),
  u("Yanlış kişiye mesaj gönderip yandığın oldu mu? Anlat."),
  u("Telefonunda en son ne arattın? Göster."),
  u("En son aradığın 5 kişiyi göster."),
  u("Son sildiğin mesaj neydi, kime?"),
  u("En son kime stalk attın?"),
  u("Galeriden en utanç verici fotoğrafını aç, göster."),
  u("Gruba ait bir utanç verici sırrını paylaş."),
  u("Okul veya iş hayatında en büyük başarısızlığın?"),
  u("Hiç ağlayarak bir şey için yalvardın mı? Ne için?"),
  u("Birinin yüzüne söyleyemeyip arkasından söylediğin en ağır laf?"),
  u("Sarhoşken hatırlamadığın bir gece var mı? Anlat ne yapmışsın."),
  u("En utandığın çocukluk fotoğrafını göster."),
  u("Hayatında sakladığın bir sır, bugün söylersen rahat hissedersin."),
  u("En son ne zaman rezil oldun?"),

  // Derin / rahatsız edici
  d("En son ne için ağladın?"),
  d("En büyük korkun ne?"),
  d("En büyük pişmanlığın?"),
  d("Ölmeden önce yapmak istediğin tek şey?"),
  d("Bugün ölsen en çok özleyeceğin kişi kim?"),
  d("Masadan birinin olmadığını hayal et — kim olurdu?"),
  d("Aileni saymazsak en sevdiğin insan kim?"),
  d("Şu an hayatından kesip atmak istediğin ne?"),
  d("10 yıl sonra bu masada herkesi görmek istiyor musun? Kim eksik olurdu?"),
  d("Kimseye söylemediğin bir hayalin var mı?"),
  d("İnsanlara kendin hakkında söylediğin en büyük yalan?"),
  d("Ailenle ilgili utandığın bir şey var mı?"),
  d("Hiç biriyle konuşmayı tamamen kestin mi? Neden?"),
  d("Hayatında geri alabileceğin tek hata hangisi olurdu?"),
  d("Çocuğun olsa kendinden hangi özelliği almasını istemezdin?"),
  d("En çok kimi yanılttığını düşünüyorsun?"),
  d("En büyük güvensizliğin ne?"),
  d("Kendinde en nefret ettiğin şey?"),
  d("Bir gün uyanıp zengin olsan hayatından kimi çıkarırdın?"),
  d("Sence bugünkü hâlinden 5 yıl önceki sen memnun olur muydu?"),

  // Sosyal / provokatif
  s("Masadan birinin sevgilisiyle çıkar mıydın? Kimle?"),
  s("Masadan biri sana itiraf etse kim şaşırtmaz?"),
  s("Kaza geçirsen ve masadan tek kişi ziyarete gelse kim olurdu?"),
  s("Masadan kime 1 milyon lira borç verirdin?"),
  s("Masadan kimi kefil gösterirdin?"),
  s("Masadan kimi silsen kimse fark etmez?"),
  s("Masadan en çok kiminle kavga edersin?"),
  s("Bu odada kim en uzun süre çenesini kapalı tutabilir sence?"),
  s("En zor gününde hangimiz yanında oldu?"),
  s("En son hangi arkadaşını çekiştirdin? (masadan biri olabilir)"),
  s("Masadan biri bir gün sana ihanet etse kim olurdu?"),
  s("Hayatına devam etsen bu masadan kimi görmeyi bırakırdın?"),
  s("Evlenirken sağdıcın/nedimen masadan kim olurdu?"),
  s("Cenazene bu masadan gelmeyeceğini düşündüğün biri var mı?"),
  s("Masadakilere küçükten büyüğe güven sıralaması yap."),

  // Eğlenceli / açığa çıkarıcı
  e("Tek seferlik bir süper gücün olsa ne olurdu, nasıl kullanırdın?"),
  e("Son 1 ayın en iyi günü hangisi?"),
  e("5 yıl önceki kendine mesaj atabilsen ne yazardın?"),
  e("Hiç birine 'senin gibi olmak isterdim' dedin mi? Kime?"),
  e("Hayatından bir kişiyi silebilsen kim olurdu?"),
  e("Cebindeki son 100 TL'yi şu an ne yapardın?"),
  e("Hayatından bir günü yeniden yaşasan hangisi?"),
  e("Son 6 ayda kendinde en büyük değişiklik ne?"),
  e("Tek kelimeyle kendini anlat."),
  e("Bu gece başlarken 'bu soruyu ben çekmem inşallah' dediğin soru hangisiydi?"),
];
