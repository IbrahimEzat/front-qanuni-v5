<template>
  <v-card class="mx-auto" style="background: #fefefe">
    <v-layout>
      <v-lazy>
        <v-app-bar color="#fefaf0" density="compact" height="70">
          <div
            class="d-flex justify-space-between align-basline mx-md-10 mx-1 pt-2"
            style="width: 100%"
          >
            <div>
              <nuxt-link to="/">
                <img src="/images/الشعار.png" alt="" style="width: 130px" />
              </nuxt-link>
            </div>
            <div class="flex-grow-1 text-sm-center text-end">
              <div class="navSectionCenter">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <img
                      src="/images/القائمة.png"
                      alt=""
                      v-bind="props"
                      class="imageNav me-2"
                    />
                  </template>
                  <v-list
                    class="mt-1 bg-lime-lighten-5 rounded-lg"
                    style="width: 230px; max-height: 500px"
                  >
                    <v-list-item style="padding: 0">
                      <div class="d-md-none d-block">
                        <div v-if="!authStore.isLogin">
                          <v-list-item-title>
                            <nuxt-link
                              :to="'/login?redirect=' + $route.path"
                              class="d-flex px-10 py-2 pontiner"
                            >
                              <img
                                src="/images/تسجيل-الدخول.png"
                                alt=""
                                style="height: 30px"
                              />
                              <!-- <span class="align-self-center font-weight-bold">تسجيل الدخول </span> -->
                            </nuxt-link>
                          </v-list-item-title>
                          <v-list-item-title>
                            <nuxt-link
                              :to="'/signup?redirect=' + $route.path"
                              class="d-flex px-10 pb-4 pontiner"
                            >
                              <img
                                src="/images/حساب-جديد.png"
                                alt=""
                                style="height: 30px; width: 120px"
                              />
                              <!-- <span class="align-self-center font-weight-bold">تسجيل الدخول </span> -->
                            </nuxt-link>
                          </v-list-item-title>
                        </div>
                        <div v-if="authStore.isLogin">
                          <v-list-item-title>
                            <nuxt-link
                              :to="'/profile/' + authStore.token.user_id"
                              dir="rtl"
                              class="d-flex ps-12 py-2 pontiner"
                            >
                              <!-- <img
                                :src="authStore.user_image"
                                alt=""
                                class="iconSm rounded-circle"
                              /> -->
                              <span class="align-self-center font-weight-bold"
                                >الصفحة الشخصية
                              </span>
                            </nuxt-link>
                            <v-divider class="border-opacity-50"></v-divider>
                          </v-list-item-title>

                          <v-list-item-title v-if="authStore.isAdmin">
                            <nuxt-link
                              :to="'/admin/dashboard'"
                              dir="rtl"
                              class="d-flex px-15 py-4 pontiner"
                            >
                              <span
                                class="align-self-center font-weight-bold me-5"
                                >لوحة التحكم
                              </span>
                              <v-icon icon="mdi-view-dashboard"></v-icon>
                            </nuxt-link>
                          </v-list-item-title>
                          <v-divider class="border-opacity-50"></v-divider>

                          <v-list-item-title>
                            <nuxt-link
                              to="/arrangment"
                              class="d-flex px-2 py-4 pontiner"
                            >
                              <span
                                class="align-self-center font-weight-bold ms-2"
                              >
                                ترتيب الاعضاء
                              </span>
                              <img
                                src="/images/ترتيب-الأعضاء.png"
                                alt=""
                                class="iconSm"
                              />
                            </nuxt-link>
                          </v-list-item-title>
                          <v-divider class="border-opacity-50"></v-divider>

                          <v-list-item-title>
                            <nuxt-link to="" class="d-flex px-2 py-4 pontiner">
                              <span class="align-self-center font-weight-bold">
                                قائمة مفضلاتي
                              </span>
                              <img
                                src="/images/قائمة-المفضلة-قبل-الضغط.png"
                                alt=""
                                class="iconSm"
                              />
                            </nuxt-link>
                          </v-list-item-title>
                          <v-divider class="border-opacity-50"></v-divider>

                          <v-list-item-title>
                            <nuxt-link
                              to="/updateProfile"
                              class="d-flex px-2 py-4 pontiner"
                            >
                              <span
                                class="align-self-center font-weight-bold ms-2"
                              >
                                تعديل حسابي
                              </span>
                              <img
                                src="/images/إعدادات-الحساب.png"
                                alt=""
                                class="iconSm"
                              />
                            </nuxt-link>
                          </v-list-item-title>
                          <v-divider class="border-opacity-50"></v-divider>

                          <v-list-item-title>
                            <nuxt-link
                              @click="authStore.logout"
                              to=""
                              class="d-flex px-2 py-4 pontiner"
                            >
                              <span class="align-self-center font-weight-bold">
                                تسجيل الخروج
                              </span>
                              <img
                                src="/images/تسجيل-الخروج.png"
                                alt=""
                                class="iconSm"
                              />
                            </nuxt-link>
                          </v-list-item-title>
                        </div>
                        <v-divider class="border-opacity-50"></v-divider>
                      </div>
                      <v-list-item-title>
                        <nuxt-link
                          to="/blogs"
                          class="d-flex justify-center py-4 pontiner"
                        >
                          <span class="align-self-center font-weight-bold"
                            >المقالات
                          </span>
                          <img src="/images/مقالات.png" alt="" class="iconSm" />
                        </nuxt-link>
                      </v-list-item-title>
                      <v-divider class="border-opacity-50"></v-divider>
                      <v-list-item-title>
                        <nuxt-link
                          to="/discussions"
                          class="d-flex justify-center py-4 pontiner"
                        >
                          <span class="align-self-center font-weight-bold">
                            مناقشات
                          </span>
                          <img
                            src="/images/مناقشات.png"
                            alt=""
                            class="iconSm"
                          />
                        </nuxt-link>
                      </v-list-item-title>
                      <v-divider class="border-opacity-50"></v-divider>
                      <v-list-item-title>
                        <nuxt-link
                          to="/library"
                          class="d-flex justify-center py-4 pontiner"
                        >
                          <span class="align-self-center font-weight-bold">
                            المكتبة
                          </span>
                          <img
                            src="/images/المكتبة.png"
                            alt=""
                            class="iconSm"
                          />
                        </nuxt-link>
                      </v-list-item-title>
                      <v-divider class="border-opacity-50"></v-divider>
                      <v-list-item-title>
                        <nuxt-link
                          to="/surveys"
                          class="d-flex justify-center py-4 pontiner"
                        >
                          <span class="align-self-center font-weight-bold">
                            استطلاعات
                          </span>
                          <img
                            src="/images/استطلاعات.png"
                            alt=""
                            class="iconSm"
                          />
                        </nuxt-link>
                      </v-list-item-title>
                      <v-divider class="border-opacity-50"></v-divider>
                      <v-list-item-title>
                        <nuxt-link
                          to="/exams"
                          class="d-flex justify-center py-4 pontiner"
                        >
                          <span class="align-self-center font-weight-bold">
                            إختبارات
                          </span>
                          <img
                            src="/images/اختبارات.png"
                            alt=""
                            class="iconSm"
                          />
                        </nuxt-link>
                      </v-list-item-title>
                      <v-divider class="border-opacity-50"></v-divider>

                      <v-list-item-title>
                        <nuxt-link
                          to="/competitions"
                          class="d-flex justify-center py-4 pontiner"
                        >
                          <span class="align-self-center font-weight-bold">
                            مسابقات
                          </span>
                          <img
                            src="/images/مسابقات.png"
                            alt=""
                            class="iconSm"
                          />
                        </nuxt-link>
                      </v-list-item-title>
                      <v-divider class="border-opacity-50"></v-divider>

                      <v-list-item-title>
                        <nuxt-link to="" class="d-flex justify-center py-4 pontiner">
                          <span class="align-self-center font-weight-bold">
                            استشارات
                          </span>
                          <img
                            src="/images/استشارات.png"
                            alt=""
                            class="iconSm"
                          />
                        </nuxt-link>
                      </v-list-item-title>
                      <v-divider class="border-opacity-50"></v-divider>

                      <v-list-item-title>
                        <nuxt-link
                          to="/services"
                          class="d-flex justify-center py-4 pontiner"
                        >
                          <span class="align-self-center font-weight-bold">
                            خدمات
                          </span>
                          <img src="/images/market.png" alt="" class="iconSm" />
                        </nuxt-link>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <nuxt-link to="/">
                  <img
                    src="/images/الرئيسية.png"
                    alt=""
                    class="d-md-inline-block d-none imageNav mx-5"
                  />
                </nuxt-link>
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <img
                      src="/images/معلومات.png"
                      alt=""
                      style="border-radius: 50%"
                      v-bind="props"
                      class="imageNav"
                    />
                  </template>
                  <v-list
                    class="mt-1 bg-lime-lighten-5 rounded-lg"
                    style="text-align: center"
                  >
                    <v-list-item-title class="px-10 py-4 pontiner">
                      <nuxt-link to="/AboutSite">
                        <span class="align-self-center font-weight-bold">
                          معلومات حول الموقع
                        </span>
                      </nuxt-link>
                    </v-list-item-title>
                    <v-divider class="border-opacity-50"></v-divider>
                    <v-list-item-title class="px-10 py-4 pontiner">
                      <nuxt-link to="/staff">
                        <span class="align-self-center font-weight-bold">
                          طاقم الموقع
                        </span>
                      </nuxt-link>
                    </v-list-item-title>
                    <v-divider class="border-opacity-50"></v-divider>
                    <v-list-item-title class="px-10 py-4 pontiner">
                      <nuxt-link to="">
                        <span class="font-weight-bold"> شركاء الموقع </span>
                      </nuxt-link>
                    </v-list-item-title>
                    <v-divider class="border-opacity-50"></v-divider>
                    <v-list-item-title class="px-10 py-4 pontiner">
                      <nuxt-link to="/contact">
                        <span class="font-weight-bold"> للتواصل معنا </span>
                      </nuxt-link>
                    </v-list-item-title>
                    <v-divider class="border-opacity-50"></v-divider>
                    <v-list-item-title class="px-10 py-4 pontiner">
                      <nuxt-link to="/questions">
                        <span class="font-weight-bold"> الأسئلة المكررة </span>
                      </nuxt-link>
                    </v-list-item-title>
                    <v-divider class="border-opacity-50"></v-divider>
                    <v-list-item-title>
                      <nuxt-link to="" class="d-flex justify-center py-4">
                        <a
                          style="color: blue"
                          href="https://www.facebook.com/AlqanoniMaroc"
                          target="_blank"
                          class="facebook pointer"
                          variant="text"
                        >
                          <v-icon icon="mdi-facebook"></v-icon>
                        </a>
                        <a
                          style="color: red"
                          href="https://www.youtube.com/@ABDELHAKTALIB"
                          target="_blank"
                          class="mx-2 youtube pointer"
                          variant="text"
                        >
                          <v-icon icon="mdi-youtube"></v-icon>
                        </a>
                        <span class="align-self-center font-weight-bold">
                          تابعنا على
                        </span>
                      </nuxt-link>
                    </v-list-item-title>
                    <v-divider class="border-opacity-50"></v-divider>
                    <v-list-item-title class="px-10 py-4 pontiner">
                      <nuxt-link to="/usage">
                        <span class="align-self-center font-weight-bold">
                          اتفاقية الاستخدام والخصوصية
                        </span>
                      </nuxt-link>
                    </v-list-item-title>
                    <v-divider class="border-opacity-50"></v-divider>
                    <v-list-item-title class="px-10 py-4 pontiner">
                      <nuxt-link to="/copyrights">
                        <span class="align-self-center font-weight-bold">
                          جميع الحقوق محفوظة
                        </span>
                      </nuxt-link>
                    </v-list-item-title>
                  </v-list>
                </v-menu>
              </div>
            </div>
            <div class="align-basline d-flex">
              <div class="d-md-block d-none">
                <div v-if="authStore.isLogin" class="d-flex aling-baseline">
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <img
                        v-bind="props"
                        style="object-fit: cover; border-radius: 50%"
                        :src="authStore.user_image"
                        alt=""
                        class="imageNav"
                      />
                    </template>
                    <v-list class="mt-1 bg-lime-lighten-5 rounded-lg">
                      <v-list-item style="padding: 0">
                        <v-list-item-title>
                          <nuxt-link
                            :to="'/profile/' + authStore.token.user_id"
                            class="d-flex px-10 py-4 pontiner"
                          >
                            <img
                              src="/images/البروفيل.png"
                              alt=""
                              class="iconSm"
                            />
                            <span class="align-self-center font-weight-bold"
                              >صفحتي الشخصية
                            </span>
                          </nuxt-link>
                        </v-list-item-title>
                        <v-divider class="border-opacity-50"></v-divider>

                        <v-list-item-title
                          v-if="authStore.isAdmin"
                          class="py-3"
                          dir="rtl"
                        >
                          <nuxt-link
                            :to="'/admin/dashboard'"
                            class="px-16 pontiner"
                          >
                            <span class="font-weight-bold">لوحة التحكم </span>
                            <v-icon icon="mdi-view-dashboard"></v-icon>
                          </nuxt-link>
                        </v-list-item-title>
                        <v-divider class="border-opacity-50"></v-divider>
                        <v-list-item-title v-if="!authStore.isAdmin">
                          <nuxt-link
                            to="/services/holdings"
                            class="d-flex px-10 py-4 pontiner"
                          >
                            <img
                              src="/images/market.png"
                              alt=""
                              class="iconSm"
                            />
                            <span class="align-self-center font-weight-bold"
                              >قائمة مشترياتي
                            </span>
                          </nuxt-link>
                        </v-list-item-title>
                        <v-divider class="border-opacity-50"></v-divider>

                        <v-list-item-title>
                          <nuxt-link
                            to="/arrangment"
                            class="d-flex px-10 py-4 pontiner"
                          >
                            <img
                              src="/images/ترتيب-الأعضاء.png"
                              alt=""
                              class="iconSm"
                            />
                            <span class="align-self-center font-weight-bold">
                              ترتيب الاعضاء
                            </span>
                          </nuxt-link>
                        </v-list-item-title>
                        <v-divider class="border-opacity-50"></v-divider>
                        <v-list-item-title>
                          <nuxt-link
                            to=""
                            class="d-flex justify-center px-10 py-4 pontiner"
                          >
                            <img
                              src="/images/قائمة-المفضلة-قبل-الضغط.png"
                              alt=""
                              class="iconSm"
                            />
                            <span class="align-self-center font-weight-bold">
                              قائمة مفضلاتي
                            </span>
                          </nuxt-link>
                        </v-list-item-title>
                        <v-divider class="border-opacity-50"></v-divider>
                        <v-list-item-title>
                          <nuxt-link
                            to="/updateProfile"
                            class="d-flex px-10 py-4 pontiner"
                          >
                            <img
                              src="/images/إعدادات-الحساب.png"
                              alt=""
                              class="iconSm"
                            />
                            <span class="align-self-center font-weight-bold">
                              تعديل حسابي
                            </span>
                          </nuxt-link>
                        </v-list-item-title>
                        <v-divider class="border-opacity-50"></v-divider>
                        <v-list-item-title>
                          <nuxt-link
                            @click="authStore.logout"
                            to=""
                            class="d-flex px-10 py-4 pontiner"
                          >
                            <img
                              src="/images/تسجيل-الخروج.png"
                              alt=""
                              class="iconSm"
                            />
                            <span class="align-self-center font-weight-bold">
                              تسجيل الخروج
                            </span>
                          </nuxt-link>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <!-- <img
                    src="/images/اشعار.png"
                    alt=""
                    class="imageNav"
                  /> -->
                </div>
                <div v-if="!authStore.isLogin" class="createAndRigsterAcount">
                  <nuxt-link :to="'/signup?redirect=' + $route.path">
                    <img src="/images/حساب-جديد.png" alt="" class="mr-4" />
                  </nuxt-link>
                  <nuxt-link :to="'/login?redirect=' + $route.path">
                    <img src="/images/تسجيل-الدخول.png" alt="" />
                  </nuxt-link>
                </div>
              </div>
              <div class="d-flex" v-if="authStore.isLogin">
                <notification-list class="mx-2" />
                <chat-list />
              </div>

              <!-- <div></div> -->
            </div>
          </div>
        </v-app-bar>
      </v-lazy>
      <div style="width: 100vw; min-height: 100vh">
        <v-main>
          <slot />
        </v-main>
      </div>
    </v-layout>
  </v-card>
</template>
<script lang="ts" setup>
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
import { responseReturn } from "~/types/tpes";
const authStore = useAuthStore();
</script>
 
<style scoped>
.imageNav {
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.iconSm {
  height: 25px;
  width: 25px;
  margin-left: 20px;
}

.pontiner {
  cursor: pointer;
}

v-list-item-title {
  text-align: center;
}

span {
  font-size: 18px;
}

.createAndRigsterAcount img {
  height: 35px;
}

a {
  text-decoration: none;
  color: black;
}
hr {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
</style>

