const params = new URLSearchParams(location.search);

function createUrl(baseUrl, pstartno, cate, keyword, ob) {
    let url = baseUrl + "?pstartno=" + pstartno;

    url += "&keyword=" + keyword;
    url += "&cate=" + cate;
    url += "&ob=" + ob;

    return url;
}

$(function () {
    $(document).on("input", ".number", function () {
        this.value = this.value
            .replace(/[^0-9-]/g, "") // 1. 숫자와 하이픈(-)이 아닌 문자는 제거
            .replace(/(?!^)-/g, ""); // 2. 문자열 시작(^)이 아닌 곳에 있는 하이픈은 제거
    });
});

var Common = {
    // 전화번호 하이픈 추가
    formatPhoneNumber: function (num) {
        if (!num) return "";

        const digits = String(num).replace(/\D/g, "");

        if (digits.length === 10) {
            // 10자리: 3-3-4
            if (digits.startsWith("02")) {
                return digits.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
            }
            return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        } else if (digits.length === 11) {
            // 11자리: 3-4-4
            return digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
        } else {
            // 그 외는 그대로 출력
            return num;
        }
    },

    // 사업자등록번호 하이픈 추가
    formatBusinessNumber: function (num) {
        if (!num) return "";

        const digits = String(num).replace(/\D/g, "");

        if (digits.length === 10) {
            // 10자리: 3-2-5
            return digits.replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3");
        } else {
            // 그 외는 그대로 출력
            return num;
        }
    },

    // 입력값 검사
    valueCheck: function (selector, message) {
        const value = Common.replaceAll($(selector).val(), " ", "");
        if (value === "") {
            alert(`${message}을(를) 입력해 주세요.`);
            $(selector).focus();
            throw new Error("validation failed");
        }
        return value;
    },

    // 이미지 변환
    imgCnv: function (byt) {
        // Base64 헤더 판별 (PNG: iVBORw0KGgo, JPG: /9j/)
        var format = byt.startsWith("/9j/") ? "jpeg" : "png";
        return `data:image/${format};base64,` + byt;
    },
    /* 모바일 확인 */
    isMobile: function () {
        var user = navigator.userAgent;
        var is_mobile = false;
        if (user.indexOf("iPhone") > -1 || user.indexOf("Android") > -1) {
            is_mobile = true;
        }
        return is_mobile;
    },
    /* 화폐 단위 콤마 */
    numberWithCommas: function (price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    /* replaceAll */
    replaceAll: function (value, org, dest) {
        return value.split(org).join(dest);
    },
    // null 체크
    nullCheck: function (data, id, name) {
        let result = false;
        if (!data || !data.trim()) {
            alert(`${name}을(를) 입력해주세요.`);
            $(`#${id}`).focus();
            result = true;
        }
        return result;
    },
    isNotNull: function (value1, value2) {
        var result = false;
        if (value1 == undefined || value1 == null || value1 == "") {
            window.Android.toastAlert("고객명을 입력해주세요.");
        } else {
            if (value2 == undefined || value2 == null || value2 == "") {
                window.Android.toastAlert("상담 내용을 입력해주세요.");
            } else {
                result = true;
            }
        }
        return result;
    },
    /* 전화번호 하이폰 추가 */
    blue: function (num) {
        var tmp = "";

        if (num.length == 11) {
            //010-1234-1234
            tmp += num.substr(0, 3);
            tmp += "-";
            tmp += num.substr(3, 4);
            tmp += "-";
            tmp += num.substr(7);
        } else {
            //02-1234-1234
            tmp += num.substr(0, 2);
            tmp += "-";
            tmp += num.substr(2, 4);
            tmp += "-";
            tmp += num.substr(6);
        }

        return tmp;
    },
    /**
     *  현재 시간을 연월일_시분초 포맷으로 반환
     */
    getCurrentFormattedTime: function () {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더해줌
        const day = String(now.getDate()).padStart(2, "0");

        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        return `${year}${month}${day}_${hours}${minutes}${seconds}`;
    },
    /**
     *  yyyy-MM-dd 포맷으로 반환
     */
    getFormatDate: function (d) {
        var date = new Date(d); // for now
        var year = date.getFullYear(); //yyyy
        var month = 1 + date.getMonth(); //M
        month = month >= 10 ? month : "0" + month; //month 두자리로 저장
        var day = date.getDate(); //d
        day = day >= 10 ? day : "0" + day; //day 두자리로 저장
        return year + "-" + month + "-" + day;
    },
    /* 현재 날짜 */
    getDate1: function () {
        var d = new Date(); // for now
        var year = d.getFullYear();
        var month = 1 + d.getMonth();
        month = month >= 10 ? month : "0" + month;
        var day = d.getDate();
        day = day >= 10 ? day : "0" + day;

        var datetext = year + "." + month + "." + day;

        return datetext;
    },

    // Axios 인스턴스
    axiosInstance: (function () {
        const version = "/api/v1/";
        const host = window.location.hostname;
        let baseURL =
            host === "localhost" || host === "192.168.0.42"
                ? "http://" + host + version
                : "http://new.surittok.com" + version;

        const instance = axios.create({
            baseURL,
            timeout: 54000,
            withCredentials: true,
        });

        // 요청 인터셉터 (토큰 등)
        instance.interceptors.request.use(
            function (config) {
                const token = localStorage.getItem("jwtToken");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            function (error) {
                return Promise.reject(error);
            },
        );

        // 응답 인터셉터 (401 → refresh → 재요청)
        let isRefreshing = false;
        let subscribers = [];

        function onRefreshed(newToken) {
            subscribers.forEach((callback) => callback(newToken));
            subscribers = [];
        }

        instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // Access Token 만료(401)
                if (
                    error.response &&
                    error.response.status === 401 &&
                    !originalRequest._retry
                ) {
                    originalRequest._retry = true;

                    // 이미 refresh 요청 중이면, refresh 완료될 때까지 기다리기
                    if (isRefreshing) {
                        return new Promise((resolve) => {
                            subscribers.push((newToken) => {
                                originalRequest.headers.Authorization =
                                    "Bearer " + newToken;
                                resolve(instance(originalRequest));
                            });
                        });
                    }

                    isRefreshing = true;

                    try {
                        const refreshToken =
                            localStorage.getItem("refreshToken");

                        if (!refreshToken) {
                            localStorage.clear();
                            location.href = "/login.html";
                            return Promise.reject(error);
                        }

                        // refresh 요청
                        const refreshRes = await axios.post(
                            baseURL + "account/refresh",
                            { login_token: refreshToken },
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            },
                        );

                        const newAccessToken =
                            refreshRes.data.token.accessToken;

                        const newRefreshToken =
                            refreshRes.data.token.refreshToken;

                        // 새로운 Token 저장
                        localStorage.setItem("jwtToken", newAccessToken);
                        localStorage.setItem("refreshToken", newRefreshToken);

                        isRefreshing = false;
                        onRefreshed(newAccessToken);

                        // 실패했던 요청 다시 보내기
                        const newRequest = {
                            ...originalRequest,
                            headers: {
                                ...originalRequest.headers,
                                Authorization: "Bearer " + newAccessToken,
                            },
                        };
                        return instance(newRequest);
                    } catch (e) {
                        isRefreshing = false;
                        localStorage.clear();
                        location.href = "login.html";
                        return Promise.reject(e);
                    }
                }
                return Promise.reject(error);
            },
        );

        return instance;
    })(),

    /**
     * axios 통신
     */
    sendAxios: async function (url, param = {}) {
        try {
            let response;

            const isFormData = param instanceof FormData;
            const isEmptyParam =
                !isFormData &&
                (param === null ||
                    param === undefined ||
                    (typeof param === "object" &&
                        Object.keys(param).length === 0));

            // param 비어있으면 GET
            if (isEmptyParam) {
                response = await this.axiosInstance.get(url);
            }
            // FormData 또는 일반 param이 있으면 POST
            else {
                response = await this.axiosInstance.post(url, param, {
                    headers: {
                        "Content-Type": isFormData
                            ? "multipart/form-data"
                            : "application/json",
                    },
                });
            }

            return response.data;
        } catch (error) {
            console.error(error);
            return { code: 500, error: error.message };
        }
    },

    // paging
    renderPaging: function (searchVO, container = "#pagingArea") {
        const $container = $(container);
        $container.empty();

        // 페이지 이동 지원 함수 (공통)
        const move = (page) => {
            if (typeof pageMove === "function") {
                pageMove(page);
            } else {
                const params = new URLSearchParams(window.location.search);
                if (params.has("pstartno")) {
                    params.set("pstartno", page);
                } else {
                    params.set("page", page);
                }
                window.location.search = params.toString();
            }
        };

        // << (맨 처음)
        $container.append(
            $("<p>")
                .text("<<")
                .click(() => {
                    if (searchVO.page > 1) {
                        move(1);
                    } else {
                        alert("처음 페이지 입니다.");
                    }
                }),
        );

        // < (이전)
        $container.append(
            $("<p>")
                .text("<")
                .click(() => {
                    if (searchVO.page > 1) {
                        move(searchVO.page - 1);
                    } else {
                        alert("처음 페이지 입니다.");
                    }
                }),
        );

        // 페이지 번호들
        for (let i = searchVO.firstPageIndex; i <= searchVO.endPageIndex; i++) {
            $container.append(
                $("<p>")
                    .text(i)
                    .toggleClass("pstarno", searchVO.page === i)
                    .click(function () {
                        move(i);
                    }),
            );
        }

        // > (다음)
        $container.append(
            $("<p>")
                .text(">")
                .click(() => {
                    if (searchVO.page < searchVO.endedPageIndex) {
                        move(searchVO.page + 1);
                    } else {
                        alert("마지막 페이지입니다.");
                    }
                }),
        );

        // >> (맨 끝)
        $container.append(
            $("<p>")
                .text(">>")
                .click(() => {
                    if (searchVO.page < searchVO.endedPageIndex) {
                        move(searchVO.endedPageIndex);
                    } else {
                        alert("마지막 페이지입니다.");
                    }
                }),
        );
    },
};
