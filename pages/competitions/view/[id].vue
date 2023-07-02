<template>
    <div dir="rtl" v-if="competition.competition" class="bg-blue-grey-lighten-5">
        <v-row>
            <v-col cols="2" class="ma-0">
                <bannar-slide></bannar-slide>
            </v-col>
            <v-col class="bg-white mt-sm-8 my-8 pa-0 mx-auto pb-10" md="8" sm="11" cols="11">
                <div style="background-color: #fdf8ef; width: 100%" class="d-flex justify-space-between px-3">
                    <p style="width: 80%" class="font-weight-bold pa-4">
                        <nuxt-link to="/competitions">مسابقات</nuxt-link> / {{ competition.competition.title }}
                    </p>

                </div>
                <bannar-center></bannar-center>
                <div class="d-flex justify-space-between mx-3">
                    <div class="">
                        <div v-if="!isFavarite" class="imageHolder align-self-center pointer" @click="toggleWishlist()">
                            <v-img style="width: 45px; height: 45px" src="/images/قائمة-المفضلة-قبل-الضغط.png"></v-img>
                        </div>
                        <div v-if="isFavarite" class="imageHolder align-self-center pointer" @click="toggleWishlist()">
                            <v-img style="width: 45px; height: 45px" src="/images/قائمة-المفضلة-بعد-الضغط.png"></v-img>
                        </div>
                    </div>
                    <div>
                        <p class="text-h5 font-weight-bold mb-10">{{ competition.competition.title }}</p>
                    </div>
                    <div></div>
                </div>
                <div class="mx-3 " style=";min-height: 200px ;">
                    <v-row>
                        <v-col class="mt-3" md="3" cols="12" style="max-height: 200px;">
                            <div class="text-center text-h6 py-5 font-weight-bold rounded-lg h-100"
                                style="border: 4px solid #424242;min-height: 200px;">
                                <div v-if="competition.competition.status > 0">
                                    <v-icon style="font-size: 55px;" icon="smi-timer-sand"></v-icon>
                                    <p>تبقى لانتهاء المسابقة
                                        <span v-if="competition.competition.status > 1" class="text-green"> {{
                                            competition.competition.status }}
                                            ايام</span>
                                        <span v-else class="text-orange-accent-4 ">تنتهي اليوم</span>
                                    </p>
                                </div>
                                <div v-else class="pt-13 pb-11 text-white mt-n5 rounded-sm "
                                    style="background: linear-gradient(rgb(82, 81, 81), rgb(198, 198, 196));">
                                    <v-icon style="font-size: 56px;" icon="mdi-lock" class="mb-2"></v-icon>
                                    <p>انتهت</p>
                                </div>
                            </div>
                        </v-col>
                        <v-col v-if="competition.competition.prize_image" class="mt-3" md="9" cols="12">
                            <div class="text-center rounded-lg"
                                style="border: 4px solid #424242;max-height: 200px; position: relative;">
                                <p style="position: absolute;top: 0,right: 0;border-radius:0 0 0 22px;z-index:3"
                                    class="text-h5 font-weight-bold ps-2 pe-5 pb-2 bg-grey-darken-3">الجائزة</p>
                                <v-img style="object-fit: cover;max-height:192px;"
                                    :src="competition.competition.prize_image"></v-img>
                            </div>
                        </v-col>
                    </v-row>
                </div>
                <div>
                    <div class="text-center rounded-lg mx-3 mt-3" v-if="competition.competition.sponsor_image"
                        style="border: 4px solid #FFD600;max-height: 200px; position: relative;">
                        <p style="position: absolute;top: 0,right: 0;border-radius:0 0 0 22px;z-index:3 "
                            class="text-h5 ps-2 pe-5 pb-2 font-weight-bold bg-yellow-accent-4">هذة المسابقة برعاية</p>
                        <a :href="competition.competition.sponsor_url" target="_blank"><v-img
                                style="object-fit: cover;max-height:192px;"
                                :src="competition.competition.sponsor_image"></v-img></a>
                    </div>
                </div>

                <div class="mx-3 my-5" v-html="competition.competition.question" id="competitionContent" style=" border-bottom: 2px solid black">
                </div>

                <!-- add answer -->
                <div>
                    <div v-if="!authStore.isLogin"
                        class="px-2 py-5 bg-blue-grey-lighten-5 justify-center align-center d-flex"
                        style="border-bottom: 2px solid black ; border-top: 2px solid black">
                        <div class="imageHolder d-md-block d-none">
                            <v-img class="mb-2" src="/images/لا-تستطيع-التعليق.png"
                                style="width: 80px; height: 80px; border-radius: 50%"></v-img>
                        </div>
                        <div class="text-center">
                            <p class="text-md-h4 text-h6">للأسف انت مجرد زائر لذلك قم ب :</p>
                            <div class="d-flex">
                                <nuxt-link :to="'/login?redirect=' + $route.path" class="d-flex px-3 py-2 pontiner">
                                    <img src="/images/تسجيل-الدخول.png" alt="" style="height: 40px" />
                                </nuxt-link>
                                <span class="text-md-h4 text-h6">او </span>
                                <nuxt-link :to="'/signup?redirect=' + $route.path" class="d-flex px-3 py-2 pontiner">
                                    <img src="/images/حساب-جديد.png" alt="" style="height: 40px; width: 120px" />
                                </nuxt-link>
                            </div>
                            <p class="text-md-h4 text-h6">لكي تستطيع المشاركة</p>
                        </div>
                    </div>

                    <div v-show="readyAddAnswer && !authStore.isAdmin" class="py-4" style="border-bottom: 2px solid black ">
                        <div style="border: 1px solid black ; border-radius: 15px;" class="mx-3 px-5">
                            <editor counter_id="counter1" id="content-editor" />
                            <div class="mt-2">
                                <input v-model="checkbox" type="checkbox" name="" id="check" />
                                <label for="check" class="mr-2 font-weight-bold">اوافق على <span style="color: red">الشروط
                                        والاحكام</span> بخصوص
                                    النشر في الموضوع</label>
                            </div>
                            <div style="text-align: end">
                                <v-btn v-if="!isupdateAnswer" :disabled="!readyToSend"
                                    variant="outlined" class="rounded-pill my-5" @click="confirmAddAnswer = true"
                                    style="color: white; background-color: #333">
                                    <p class="text-h6">شارك</p>

                                </v-btn>
                                <v-btn v-else :disabled="!readyToSend" :loading="addOpinionLoading" variant="outlined"
                                    class="rounded-pill my-5" @click="updateAnswer"
                                    style="color: white; background-color: #333">
                                    <p class="text-h6">تعديل المشاركة</p>
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- ********************* -->
                <div v-if="competitionisActive">
                    <p class="text-center text-h6 py-3 my-3 mx-5 bg-grey-lighten-3">سيتم عرض المشاركات بعد قفل المسابقة و
                        تصحيحها </p>
                </div>

                <!-- مشاركة المستخدم ************************** -->
                <div class="mx-4 mb-5" v-if="currentAnswer">
                    <div style="border: 1px solid #333">
                        <div class="d-flex justify-space-between ps-3 bg-grey-darken-4">
                            <div class="d-flex">
                                <p class="align-self-center me-3"> مشاركتك الحالية</p>

                                <span style="font-size: 25px" class="mdi mdi-calendar-range align-self-center me-2"></span>
                                <p class="align-self-center">
                                    {{
                                        new Date(currentAnswer.created_at).toLocaleDateString([
                                            "ban",
                                            "id",
                                        ])
                                    }}
                                </p>
                            </div>
                            <div>

                                <div>
                                    <v-btn color="info" @click="showUpdate" class="ma-3">تعديل المشاركة</v-btn>
                                </div>


                            </div>
                        </div>
                        <div class="px-5 py-3 content" v-html="currentAnswer.content"></div>

                    </div>
                </div>
                <!-- ********************* -->
                <div v-if="authStore.isAdmin || !competitionisActive">
                    <div class="d-flex justify-space-between px-5 py-2">
                        <p class="text-md-h6">
                            المشاركين <span class="text-red">({{ answers.length }})</span>
                        </p>
                        <div>
                            <v-btn color="green" @click="submitCompetitioni" v-if="authStore.isAdmin && !isCompetitionCorrect">اعتماد التصحيح</v-btn>
                        </div>
                        <div class="d-flex">
                            <p class="text-h6 d-md-block d-none">ترتيب حسب :</p>
                            <v-select v-if="!isCompetitionCorrect" label="Select" style="max-width: 180px; min-width: 120px;width: 180px;height: 45px; "
                                variant="outlined" density="compact" v-model="filterSelect" item-title="name"
                                item-value="value" :items="[
                                    { name: 'الاحدث اولا', value: 'newest' },
                                    { name: 'الاقدم اولا', value: 'oldest' },
                                    { name: 'الاقل تقييما', value: 'leastRating' },
                                    { name: 'الأكثر تقييما', value: 'mostRating' },
                                ]">
                                <template v-slot:item="{ props }">
                                    <v-list-item v-bind="props" class="text-end"></v-list-item>
                                </template>
                            </v-select>
                            <v-select v-else label="Select" style="max-width: 180px; min-width: 120px;width: 180px;height: 45px; "
                                variant="outlined" density="compact" v-model="filterSelect" item-title="name"
                                item-value="value" :items="[
                                    { name: 'الاحدث اولا', value: 'newest' },
                                    { name: 'الاقدم اولا', value: 'oldest' },
                                    { name: 'الاقل تقييما', value: 'leastRating' },
                                    { name: 'الأكثر تقييما', value: 'mostRating' },
                                    { name: 'الاعلى درجات', value: 'mostMark' },
                                    { name: 'الأقل درجات', value: 'leastMark' },
                                ]">
                                <template v-slot:item="{ props }">
                                    <v-list-item v-bind="props" class="text-end"></v-list-item>
                                </template>
                            </v-select>
                        </div>
                    </div>
                </div>
                <!-- كل المشاركات ********************************** -->
                <div class="mx-4 mb-5" v-if="authStore.isAdmin || !competitionisActive">
                    <div style="border: 1px solid #333" v-for="(answer, index) in currentAnswers" :key="index">
                        <div class="d-flex justify-space-between ps-3 bg-grey-darken-4 text-md-subtitle-1 text-body-2">
                            <div class="d-flex">
                                <p class="align-self-center me-3 d-md-block d-none">المشاركة رقم {{ index + 1 }}</p>
                                <v-img class="my-2 me-3 align-self-center pointer d-md-block d-none" :src="answer.user.image"
                                    style="width: 40px; height: 40px; border-radius: 50%"></v-img>
                                <p class="align-self-center me-3">{{ answer.user.name }}</p>
                                <span style="font-size: 25px" class="mdi mdi-calendar-range align-self-center me-2 d-md-block d-none"></span>
                                <p class="align-self-center d-md-block d-none">
                                    {{
                                        new Date(answer.created_at).toLocaleDateString([
                                            "ban",
                                            "id",
                                        ])
                                    }}
                                </p>
                            </div>
                            <div>
                                <div class="d-flex">
                                    <div v-if="authStore.isAdmin && !isCompetitionCorrect">
                                        <v-btn @click="showCorrection(answer.id)" color="info" class="ma-3">تصحيح
                                            المشاركة</v-btn>
                                    </div>
                                    <div v-if="authStore.isAdmin || isCompetitionCorrect">
                                        <p class="bg-white px-3 py-1 mx-2 my-3 rounded-xl" v-if="answer.degree == 0">لم يصحح
                                            بعد </p>
                                        <p class="bg-white px-3 py-1 mx-2 my-3 rounded-xl" v-else> {{ answer.degree }} /20
                                        </p>
                                    </div>
                                    <div v-if="isCompetitionCorrect">
                                        <div v-if="answer.competition_answer_prize">
                                            <v-icon v-if="answer.competition_answer_prize.type == 'gold'" style="color: gold;"
                                            size="x-large" class="me-3 my-3" icon="mdi-trophy"></v-icon>
                                        <v-icon v-else-if="answer.competition_answer_prize.type == 'silver'"
                                            style="color: silver;" size="x-large" class="me-3 my-3"
                                            icon="mdi-trophy"></v-icon>
                                        <v-icon v-else-if="answer.competition_answer_prize.type == 'bronze'"
                                            style="color: #c15b03" size="x-large" class="me-3 my-3"
                                            icon="mdi-trophy"></v-icon>
                                        </div>        
                                        <v-icon v-else-if="answer.degree > 10" style="color: green" size="x-large"
                                            class="me-3 my-3" icon="mdi-check-bold"></v-icon>
                                        <v-icon v-else-if="answer.degree == 10" style="color: rgb(240, 111, 6)"
                                            size="x-large" class="me-3 my-3" icon="mdi-check-bold"></v-icon>
                                        <v-icon v-else style="color:red" size="x-large" class="me-3 my-3"
                                            icon="mdi-close"></v-icon>
                                    </div>
                                    <div class="d-flex flex-column py-1 px-5 bg-white"
                                        style="border-bottom: 1px solid #333">
                                        <div class="imageHolder align-self-center pointer" >
                                            <v-img :width="20" src="/images/زائد-كبير.png" @click="addPoint(answer.id)"></v-img>
                                        </div>
                                        <p class="justify-self-center text-center">
                                            {{ answer.competition_answer_point.answer_points }}
                                        </p>
                                        <div class="imageHolder align-self-center pointer">
                                            <v-img :width="20" src="/images/ناقص-كبير.png" @click="minusPoint(answer.id)"></v-img>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="px-5 py-3 content" v-html="answer.content"></div>
                    </div>
                </div>
                <!-- ********************************* -->
                <div class="text-center" >
                    <v-btn variant="tonal" color="black" v-if="currentAnswers.length < answers.length"
                        @click="pageNumber++"
                        >عرض المزيد</v-btn>
                </div>
                <!-- ************************ -->
            </v-col>
            <v-col cols="2">
                <bannar-slide></bannar-slide>
            </v-col>
            <v-dialog v-model="dialogCorrection" transition="dialog-top-transition" width="auto">
                <v-card elevation="4" class="text-center" max-width="300">
                    <v-card-text>
                        <v-card-title class=" text-h4">تصحيح الاجابة</v-card-title>
                        <div class="">
                            <v-text-field type="number" v-model="degree" dir="rtl" density="compact" clearable
                                variant="outlined"></v-text-field>
                            <span>ادخل علامة التصيحيح من 1 الى 20 </span>
                        </div>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn variant="flat" color="red" @click="dialogCorrection = false">اغلاق</v-btn>
                        <v-btn variant="flat" color="success" @click="correctionAnswer">تصحيح</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialog" transition="dialog-top-transition" width="auto">
                <v-card elevation="4" class="text-center" max-width="300">
                    <v-card-text class="text-h6">
                        <v-card-title class="text-error text-h4">عفوا</v-card-title>
                        <div class="">
                            أنت لا تستطيع اجراء هذة العملية يجب عليك تسجيل الدخول أولا
                        </div>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn variant="flat" color="success" @click="dialog = false">موافق</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="confirmAddAnswer" transition="dialog-top-transition" width="auto">
                <v-card elevation="4" class="text-center" max-width="300">
                    <v-card-text class="text-h6">
                        <v-card-title class="text-error text-h4">تاكيد المشاركة</v-card-title>
                        <div class="">
                            سيتم خصم {{ competition.competition.points }} نقطة للمشاركة في هذه المسابقة
                        </div>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn variant="flat" :loading="addAnswerLoading" color="success" @click="addAnswer">موافق</v-btn>
                        <v-btn variant="flat" color="red" @click="confirmAddAnswer = false">اغلاق</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </v-row>
    </div>
</template>
      
<script setup>
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";

const route = useRoute();
const { setToastMessage } = useSettingsStore();
const authStore = useAuthStore();

const competition = ref();
const currentAnswer = ref();


const loadWishlist = ref(true);
const dialog = ref(false);

const filterSelect = ref("newest");
const pageNumber = ref(1);
const itemPerPage = ref(3);
const isFavarite = ref(false);
const addCompetitionview = useCookie("addcompetitionview", {
    maxAge: 60 * 60 * 24,
});



const isCompetitionCorrect = ref(false);
const answers = ref([]);
const isAnswer = ref(false);
const isupdateAnswer = ref(false);
const competitionisActive = ref(false);

const readyAddAnswer = computed(() => {
    return (!isAnswer.value || isupdateAnswer.value) && authStore.isLogin && competitionisActive.value;
});

const { data, error } = await useSendRequest("/competitions/details ", {
    competition_id: route.params.id,
    token: authStore.token
});
if (error.value) {
    setToastMessage(error.value.message);
} else if (data.value?.status) {
    competition.value = data.value.data;
    competitionisActive.value = competition.value.competition.status > 0 ? true : false
    currentAnswer.value = competition.value.userAnswer ?? ''
    isAnswer.value = competition.value.userAnswer ? true : false
    isCompetitionCorrect.value = data.value.data.competition.is_correct
    answers.value = data.value.data.answers ?? [];
    if(isCompetitionCorrect.value && !competitionisActive.value)
        filterSelect.value = ''
    checkWishList();
    increaseView();
} else {
    setToastMessage(data.value?.message);
    console.log(data.value);
}


async function increaseView() {

    if (!addCompetitionview.value ||
        addCompetitionview.value.indexOf(route.params.id) == -1) {
        const { data, error } = await useSendRequest("/competitions/increaseViews", {
            competition_id: route.params.id,
        });
        if (error.value) {
            setToastMessage(error.value.message);
            return;
        }
        if (data.value?.status) {
            if (!addCompetitionview.value) {
                addCompetitionview.value = [route.params.id];
            } else {
                addCompetitionview.value.push(route.params.id);
            }
        }
    }
}

async function toggleWishlist() {

    if (!loadWishlist.value) return;
    if (authStore.isLogin) {
        loadWishlist.value = false;
        const { data, error } = await useSendRequest("/competitions/toggleWishlist", {
            competition_id: route.params.id,
            token: authStore.token,
        });
        loadWishlist.value = true;
        if (error.value) {
            setToastMessage(error.value.message);
            return;
        }
        if (data.value?.status) {
            isFavarite.value = data.value.data;
        }
    } else {
        dialog.value = true;
    }
}
async function checkWishList() {

    const { data, error } = await useSendRequest("/competitions/checkWishlist", {
        competition_id: route.params.id,
        token: authStore.token,
    });
    if (error.value) {
        setToastMessage(error.value.message);
        return;
    }
    if (data.value?.status) {
        isFavarite.value = data.value.data;
    }
}


// **************************

async function submitCompetitioni() {
    let isAllCorrect = true;
    answers.value.forEach(item => {
        if(item.degree == 0) {
            setToastMessage('لم يتم تصحيح كل الاجابات');
            isAllCorrect = false
        }
    });

    if(isAllCorrect) {
        const { data, error } = await useSendRequest('/competitions/answers/submitCorrect', {
            token: authStore.token,
            competition_id: route.params.id
        })
        if (error.value) {
            setToastMessage(error.value.message);
        } else if (data.value?.status) {
            isCompetitionCorrect.value = true;
            answers.value = data.value.data.data ?? [];
            filterSelect.value = ''
            // data.value.data.dataNotify.forEach( (item) =>{
            //     sendCorrectNotification(item);
            // })
            data.value.data.dataNotifyTop.forEach( (item) =>{
                sendTopCorrectNotification(item);
            })
        } else {
            setToastMessage(data.value?.message);
            console.log(data.value);
        }
    }
}

// async function sendCorrectNotification(dataNotify) {
//   const{data , error} =  await useSendRequest("/notificatoin/competition-correct", {
//     dataNotify: dataNotify,
//   });

// }

async function sendTopCorrectNotification(dataNotify) {
  const{data , error} =  await useSendRequest("/notificatoin/competition-prizes", {
    dataNotify: dataNotify,
  });

}

//**********************
const confirmAddAnswer = ref(false);
const addAnswerLoading = ref(false);


const checkbox = ref(false);
const readyToSend = computed(() => {
    return checkbox.value;
});
async function addAnswer() {
    const content = document.getElementById("content-editor")?.firstChild.innerHTML;
    addAnswerLoading.value = true
    const { data, error } = await useSendRequest("/competitions/answers/add", {
        competition_id: route.params.id,
        content: content,
        token: authStore.token,
    });
    addAnswerLoading.value = false;
    confirmAddAnswer.value = false;
    if (error.value) {
        setToastMessage(error.value.message);
        addAnswerLoading.value = false
    } else if (data.value?.status) {
        currentAnswer.value = data.value.data;
        isAnswer.value = true;
    } else {
        setToastMessage(data.value?.message);
    }
}

// **************************

function showUpdate() {
    isupdateAnswer.value = true;
    let myContainer = document.getElementById("content-editor")
        ?.firstChild
    myContainer.innerHTML = currentAnswer.value.content;
    checkbox.value = true
}

async function updateAnswer() {

    const content = document.getElementById("content-editor")?.firstChild.innerHTML;
    addAnswerLoading.value = true;
    const { data, error } = await useSendRequest('/competitions/answers/update', {
        answer_id: currentAnswer.value.id,
        competition_id: route.params.id,
        token: authStore.token,
        content: content
    });
    addAnswerLoading.value = false;
    if (error.value) {
        setToastMessage('حدث خطا ما');
    } else if (data.value?.status) {
        currentAnswer.value = data.value.data;
        isupdateAnswer.value = false;
    } else {
        setToastMessage(data.value?.message);
    }
}

async function addPoint(answerId) {
  
  if (authStore.isLogin) {
    addAnswerLoading.value = true;
    const { data, error } = await useSendRequest("/competitions/answers/increasePoints", {
        answer_id:answerId,
      token: authStore.token,
    });
    addAnswerLoading.value = false;

    if (error.value) {
      setToastMessage(error.value?.message);
      return;
    }
    if (data.value?.status) {
      answers.value.forEach((item) =>{
        if(item.id == answerId){
            item.competition_answer_point.answer_points = data.value.data
        }
      } );
    } else {
      setToastMessage(data.value.message);
    }
  } else {
    dialog.value = true;
  }
}

async function minusPoint(answerId) {
  
  if (authStore.isLogin) {
    addAnswerLoading.value = true;
    const { data, error } = await useSendRequest("/competitions/answers/decreasePoints", {
        answer_id:answerId,
      token: authStore.token,
    });
    addAnswerLoading.value = false;

    if (error.value) {
      setToastMessage(error.value?.message);
      return;
    }
    if (data.value?.status) {
      answers.value.forEach((item) =>{
        if(item.id == answerId){
            item.competition_answer_point.answer_points = data.value.data
        }
      } );
    } else {
      setToastMessage(data.value.message);
    }
  } else {
    dialog.value = true;
  }
}


// **************************
const dialogCorrection = ref(false);
const degree = ref(0);
const answerWentId = ref();

function showCorrection(id) {
    answers.value.forEach(element => {
        if (element.id == id) {
            degree.value = element.degree;
        }
    });
    dialogCorrection.value = true;
    answerWentId.value = id;
}

async function correctionAnswer() {
    if (degree.value > 0 && degree.value <= 20) {
        const { data, error } = await useSendRequest("/competitions/answers/degree/update", {
            answer_id: answerWentId.value,
            degree: degree.value,
            token: authStore.token
        });
        if (error.value) {
            setToastMessage('حدث خطا ما');
        } else if (data.value?.status) {
            dialogCorrection.value = false;
            answers.value.forEach(element => {
                if (element.id == answerWentId.value) {
                    element.degree = degree.value;
                }
            });

            answerWentId.value = -1;
            setToastMessage('تم اضافة العلامة بنجاح');
        } else {
            setToastMessage(data.value?.message);
            console.log(data.value);
        }
    }
}


// ******************** filtering answers
const fillterAnswers = computed(() => {
  if (filterSelect.value == "newest") {
    return answers.value.sort(function (a, b) {
      if (a.created_at < b.created_at) return 1;
      return -1;
    });
  } else if (filterSelect.value == "oldest") {
    return answers.value.sort(function (a, b) {
      if (a.created_at > b.created_at) return 1;
      return -1;
    });
  } else if (filterSelect.value == "leastRating") {
    return answers.value.sort(function (a, b) {
      if (a.competition_answer_point.answer_points > b.competition_answer_point.answer_points)
        return 1;
      return -1;
    });
  } else if (filterSelect.value == "mostRating") {
    return answers.value.sort(function (a, b) {
      if (a.competition_answer_point.answer_points < b.competition_answer_point.answer_points)
        return 1;
      return -1;
    });
  } else if (filterSelect.value == "mostMark") {
    return answers.value.sort(function (a, b) {
      if (a.degree < b.degree)
        return 1;
      return -1;
    });
  } else if (filterSelect.value == "leastMark") {
    return answers.value.sort(function (a, b) {
      if (a.degree > b.degree)
        return 1;
      return -1;
    });
  }
  return answers.value;
});

const currentAnswers = computed(() => {
  return fillterAnswers.value?.slice(0, itemPerPage.value * pageNumber.value);
});



const decriptionMeta = computed(() => {
    if (process.client) return document.getElementById("competitionContent")?.textContent;
    return competition.value.competition.title;
});

useHead({
    title: competition.value.competition.title,
    meta: [
        { name: "description", content: decriptionMeta.value },
        { property: "og:description", content: decriptionMeta.value },
        { property: "og:image", content: '/images/مسابقات.png' },
        { name: "twitter:card", content: "summay_large_image" },
        { property: 'og:locale', content: 'ar_ar' },
        { property: 'og:url', content: 'https://alqanouni.com/' },
        { property: 'og:type', content: 'website' }
    ],
    link: [{ rel: 'canonical', href: 'https://alqanouni.com/' }],
});
</script>
      
<style>
.pointer {
    cursor: pointer;
}

.ql-editor img {
    max-width: 100% !important; 
    max-height: 400px !important;
}

.ql-editor {
    min-height: 100px;
}
</style>