export declare const Game: {
    QQPK: {
        name: string;
        cp_key: number;
        key: string;
        secret_key: string;
        agent_code: string;
        url: string;
        img_url: string;
        call_url: string;
        req_call_timeout: number;
        game_type: string;
        trans_stored: {
            round: number;
            bet_trans: number;
            result_trans: number;
            tip_trans: null;
            withdraw_trans: number;
            deposit_trans: number;
        };
        language: {
            ko: string;
            en: string;
            jp: string;
        };
        language_def: string;
        currency_type: string[];
        child_server_ip: string[];
        degit: number;
    };
    FASTSPIN: {
        name: string;
        cp_key: number;
        url: string;
        img_url: string;
        call_url: string;
        game_type: string;
        wallet: string;
        req_call_timeout: number;
        trans_stored: {
            ROUND: number;
            BET_TRANS: number;
            RESULT_TRANS: number;
            TIP_TRANS: number;
        };
        language: {
            KO: string;
            EN: string;
        };
        language_def: string;
        bet_limit: {
            A: string;
            B: string;
            C: string;
        };
        bet_limit_def: string;
        degit: number;
        secret_key: string;
        merchant_code: string;
    };
    DEF: {
        name: string;
        cp_key: number;
    };
    Evolution: {
        name: string;
        prov_code: string;
        cp_key: number;
        key: string;
        api_token: string;
        lobby_token: string;
        history_token: string;
        use_trans_log: boolean;
        game_type: string;
        url: string;
        bet_limit: {
            A: string;
            B: string;
            C: string;
        };
        bet_limit_def: string;
        language_def: string;
        trans_stored: {
            ROUND: number;
            BET_TRANS: number;
            RESULT_TRANS: number;
            TIP_TRANS: number;
        };
        req_call_timeout: number;
        degit: number;
    };
    CQ9: {
        name: string;
        cp_key: number;
        digit: number;
    };
    CQ9_LIVE: {
        name: string;
        cp_key: number;
        digit: number;
    };
    CQ9_LIVE_MOTIVATION: {
        name: string;
        cp_key: number;
        digit: number;
    };
    CQ9_GROUP: {
        name: string;
        cp_key: number;
        key: string;
        url: string;
        call_url: string;
    };
    PP: {
        name: string;
        cp_key: number;
        pid: string;
        key: string;
        url: string;
        img_url: string;
        call_url: string;
        studio: string;
        game_type: string;
        wallet: string;
        req_call_timeout: number;
        trans_stored: {
            round: number;
            bet_trans: number;
            result_trans: number;
            tip_trans: number;
        };
        language: {
            ko: string;
            en: string;
        };
        language_def: string;
    };
    PP_BT: {
        name: string;
        cp_key: number;
        pid: string;
        key: string;
        url: string;
        img_url: string;
        call_url: string;
        studio: string;
        game_type: string;
        wallet: string;
        req_call_timeout: number;
        language: {
            ko: string;
            en: string;
        };
        language_def: string;
    };
    PP_LIVE: {
        name: string;
        cp_key: number;
        pid: string;
        key: string;
        url: string;
        img_url: string;
        call_url: string;
        studio: string;
        game_type: string;
        wallet: string;
        bet_limit: {
            A: string;
            B: string;
            C: string;
            D: string;
            E: string;
        };
        language_def: string;
        degit: number;
        bet_limit_def: string;
        req_call_timeout: number;
    };
    PP_REELKINGDOM: {
        name: string;
        cp_key: number;
        studio: string;
        game_type: string;
        req_call_timeout: number;
    };
    PP_FATPANDA: {
        name: string;
        cp_key: number;
        pid: string;
        key: string;
        url: string;
        img_url: string;
        call_url: string;
        studio: string;
        game_type: string;
        wallet: string;
        req_call_timeout: number;
    };
    DG: {
        name: string;
        cp_key: number;
        pid: string;
        key: string;
        fix: string;
        url: string;
        game_data_url: string;
        call_url: string;
        bet_limit_value: {
            "1": {
                min: number;
                max: number;
            };
            "2": {
                min: number;
                max: number;
            };
            "3": {
                min: number;
                max: number;
            };
            "4": {
                min: number;
                max: number;
            };
            "5": {
                min: number;
                max: number;
            };
            "6": {
                min: number;
                max: number;
            };
            "7": {
                min: number;
                max: number;
            };
            "8": {
                min: number;
                max: number;
            };
            "9": {
                min: number;
                max: number;
            };
            "10": {
                min: number;
                max: number;
            };
            "11": {
                min: number;
                max: number;
            };
            "12": {
                min: number;
                max: number;
            };
            "13": {
                min: number;
                max: number;
            };
            "14": {
                min: number;
                max: number;
            };
            "15": {
                min: number;
                max: number;
            };
            "16": {
                min: number;
                max: number;
            };
            "17": {
                min: number;
                max: number;
            };
            "18": {
                min: number;
                max: number;
            };
            "19": {
                min: number;
                max: number;
            };
            "20": {
                min: number;
                max: number;
            };
            "21": {
                min: number;
                max: number;
            };
            "22": {
                min: number;
                max: number;
            };
        };
        bet_limit: {
            A: string;
            B: string;
            C: string;
            D: string;
            E: string;
            F: string;
            G: string;
            H: string;
            I: string;
            J: string;
            K: string;
            L: string;
            M: string;
            N: string;
            O: string;
            P: string;
            Q: string;
            R: string;
            S: string;
            T: string;
            U: string;
            V: string;
        };
        bet_limit_def: string;
        language: {
            ko: string;
            en: string;
        };
        language_def: string;
        req_call_timeout: number;
    };
    BNG: {
        name: string;
        cp_key: number;
        url: string;
        img_url: string;
        call_url: string;
        studio: string;
        game_type: string;
        wallet: string;
        req_call_timeout: number;
        trans_stored: {
            round: number;
            bet_trans: number;
            result_trans: number;
            tip_trans: number;
        };
        language: {
            KO: string;
            EN: string;
        };
        language_def: string;
        bet_limit: {
            A: string;
            B: string;
            C: string;
        };
        bet_limit_def: string;
        degit: number;
    };
    BNG_PLAYSON: {
        name: string;
        cp_key: number;
        req_call_timeout: number;
    };
    WM_LIVE: {
        name: string;
        cp_key: number;
        pid: string;
        key: string;
        url: string;
        call_url: string;
        language: {
            ko: number;
            en: number;
        };
        language_def: number;
        voice_def: string;
    };
    NetEnt: {
        name: string;
        prov_code: string;
        cp_key: number;
        game_type: string;
        language_def: string;
    };
    RedTiger: {
        name: string;
        prov_code: string;
        cp_key: number;
        game_type: string;
        language_def: string;
    };
    NoLimitCity: {
        name: string;
        prov_code: string;
        cp_key: number;
        game_type: string;
        language_def: string;
    };
    BTG: {
        name: string;
        prov_code: string;
        cp_key: number;
        game_type: string;
        language_def: string;
    };
    NextSpin: {
        name: string;
        cp_key: number;
        key: string;
        api_token: string;
        url: string;
        language_def: string;
    };
    PlayStar: {
        name: string;
        cp_key: number;
        pid: string;
        token: string;
        key: string;
        api_url: string;
        history_url: string;
    };
    PNG: {
        name: string;
        cp_key: number;
        pid: string;
        KEY: string;
        URL: string;
        API_URL: string;
    };
    PG: {
        name: string;
        cp_key: number;
        pid: string;
        key: string;
        key_salt: string;
        url: string;
        game_data_url: string;
        public_url: string;
        launch_url: string;
        get_url: string;
        call_url: string;
        game_code_fix: string;
    };
    TG: {
        cp_key: number;
        name: string;
        pid: string;
        key: string;
        url: string;
        call_url: string;
        fix: string;
        log_type: number;
        bet_limit_value: {
            "1": {
                min: number;
                max: number;
                tie_min: number;
                tie_max: number;
                pair_min: number;
                pair_max: number;
            };
            "2": {
                min: number;
                max: number;
                tie_min: number;
                tie_max: number;
                pair_min: number;
                pair_max: number;
            };
            "3": {
                min: number;
                max: number;
                tie_min: number;
                tie_max: number;
                pair_min: number;
                pair_max: number;
            };
            "4": {
                min: number;
                max: number;
                tie_min: number;
                tie_max: number;
                pair_min: number;
                pair_max: number;
            };
            "5": {
                min: number;
                max: number;
                tie_min: number;
                tie_max: number;
                pair_min: number;
                pair_max: number;
            };
        };
        bet_limit: {
            A: string;
            B: string;
            C: string;
            D: string;
            E: string;
        };
        bet_limit_def: string;
    };
    TG_STELLA: {
        cp_key: number;
        name: string;
        pid: string;
        key: string;
        url: string;
        call_url: string;
        fix: string;
        log_type: number;
        bet_limit_value: {
            "1": {
                min: number;
                max: number;
                tie_min: number;
                tie_max: number;
                pair_min: number;
                pair_max: number;
            };
            "2": {
                min: number;
                max: number;
                tie_min: number;
                tie_max: number;
                pair_min: number;
                pair_max: number;
            };
            "3": {
                min: number;
                max: number;
                tie_min: number;
                tie_max: number;
                pair_min: number;
                pair_max: number;
            };
            "4": {
                min: number;
                max: number;
                tie_min: number;
                tie_max: number;
                pair_min: number;
                pair_max: number;
            };
            "5": {
                min: number;
                max: number;
                tie_min: number;
                tie_max: number;
                pair_min: number;
                pair_max: number;
            };
        };
        bet_limit: {
            A: string;
            B: string;
            C: string;
            D: string;
            E: string;
        };
        bet_limit_def: string;
    };
    AG: {
        cp_key: number;
        name: string;
        digit: number;
        bet_limit: {
            A: string;
            B: string;
            C: string;
            D: string;
            E: string;
            F: string;
            G: string;
            H: string;
            I: string;
        };
        bet_limit_def: string;
    };
    AG_SLOT: {
        cp_key: number;
        name: string;
        digit: number;
    };
    AG_GROUP: {
        cp_key: number;
        name: string;
        pid: string;
        prud_id: string;
        key_md5: string;
        key_des: string;
        act: number;
        url: string;
        game_url: string;
        url_session: string;
        call_url: string;
        id_length: number;
        prefix: string;
        language: {
            ko: number;
            en: number;
        };
        language_def: number;
    };
    Habanero: {
        name: string;
        cp_key: number;
        pid: string;
        key: string;
        url: string;
        game_url: string;
        history_url: string;
        call_url: string;
    };
    Sports: {
        name: string;
        cp_key: number;
        url: string;
        call_url: string;
    };
    Taishan: {
        name: string;
        cp_key: number;
        pid: string;
        key: string;
        url: string;
        call_url: string;
        fix: string;
        req_call_timeout: number;
    };
    Dowin: {
        name: string;
        cp_key: number;
        pid: string;
        key: string;
        url: string;
        call_url: string;
        digit: number;
        fix: string;
        bet_limit_value: {
            "1": {
                bet_n_min: number;
                bet_n_max: number;
                bet_t_min: number;
                bet_t_max: number;
                bet_r_min: number;
                bet_r_max: number;
            };
            "2": {
                bet_n_min: number;
                bet_n_max: number;
                bet_t_min: number;
                bet_t_max: number;
                bet_r_min: number;
                bet_r_max: number;
            };
        };
        bet_limit: {
            A: string;
            B: string;
        };
        bet_limit_def: string;
        language: {
            ko: string;
            en: string;
            jp: string;
        };
        language_def: string;
    };
    MGP: {
        name: string;
        prov_code: string;
        cp_key: number;
        game_type: string;
    };
    MGP_GRAND: {
        name: string;
        prov_code: string;
        cp_key: number;
        game_type: string;
    };
    MGP_SLOT: {
        name: string;
        prov_code: string;
        cp_key: number;
        game_type: string;
        lobby_gamecode: string;
    };
    MOA_EVOLUTION: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_EVOPLAY: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_YGG: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_PP: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_BNG: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_RTG: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_QUICKSPIN: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_WAZDAN: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_NETENT: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_EZUGI: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_REDTIGER: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_HABANERO: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_PLAYNGO: {
        NAME: string;
        cp_key: number;
        game_type: string;
    };
    MOA_RELAX: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_PPL: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_TRIPLEPG: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_GAMEART: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_BLUEPRINT: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_THUNDERKICK: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_NOLIMITCITY: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_MOBILOTS: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_PLAYPEARLS: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_DRAGOONSOFT: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_BETGAMESTV: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_SKYWINDLIVE: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_SKYWINDCASINO: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_1X2: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_ELK: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_VIVO: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    MOA_ONLYPLAY: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    AllBet: {
        cp_key: number;
        name: string;
        pid: number;
        key: string;
        url: string;
        call_url: string;
    };
    KD: {
        cp_key: number;
        name: string;
        pid: string;
        key: string;
        url: string;
        call_url: string;
        language_def: string;
    };
    DC_EVOPLAY: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    DC_YGG: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    DC_PNG: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    DC_RELAX: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    DC_AVATARUX: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    DC_HACKSAW: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    DC_OCTOPLAY: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    DC_NOVOMATIC: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    DC_BGAMING: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    DC_BLUEPRINT: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    DC_THUNDERKICK: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    VIVO: {
        name: string;
        cp_key: number;
        pid: string;
        key: string;
        url: string;
        call_url: string;
    };
    PlayTech: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    PlayTech_slot: {
        name: string;
        cp_key: number;
        game_type: string;
    };
    BTI: {
        name: string;
        cp_key: number;
        pid: string;
        key: string;
        url: string;
        call_url: string;
        game_type: string;
        bet_limit_def: string;
        trans_stored: {
            ttl: {
                round: number;
                bet_trans: number;
                result_trans: number;
                tip_trans: number;
            };
        };
    };
    WildGames: {
        name: string;
        cp_key: number;
        pid: string;
        key: string;
        url: string;
        call_url: string;
        trans_stored: {
            ttl: {
                round: number;
                bet_trans: number;
                result_trans: number;
                tip_trans: number;
            };
        };
        digit: number;
    };
    ASTAR: {
        name: string;
        prov_code: string;
        cp_key: number;
        pid: string;
        token: string;
        key: string;
        url: string;
        log_view_url: string;
        call_url: string;
        time_zone: number;
    };
    AWC_SEXY: {
        name: string;
        cp_key: number;
        game_type: string;
        digit: number;
        bet_limit: {
            A: string;
            B: string;
            C: string;
            D: string;
            E: string;
            F: string;
        };
        bet_limit_def: string;
        trans_stored: {
            ttl: {
                round: number;
                bet_trans: number;
                result_trans: number;
                tip_trans: number;
            };
        };
    };
    FC: {
        name: string;
        prov_code: string;
        cp_key: number;
        pid: string;
        key: string;
        url: string;
        call_url: string;
        language: {
            ko: number;
            en: number;
            jp: number;
        };
        language_def: number;
    };
    JDB_JDB: {
        name: string;
        prov_code: string;
        cp_key: number;
        game_type: string;
        paymode: string;
    };
    JDB_HRG: {
        name: string;
        prov_code: string;
        cp_key: number;
        game_type: string;
        paymode: string;
        bet_limit: {
            A: string;
            B: string;
            C: string;
            D: string;
            E: string;
        };
        bet_limit_def: string;
    };
    DBCasino: {
        name: string;
        prov_code: string;
        cp_key: number;
        pid: string;
        key: string;
        key_md5: string;
        key_data_md5: string;
        url: string;
        history_url: string;
        call_url: string;
        digit: number;
        req_call_timeout: number;
        language: {
            ko: number;
            en: number;
            jp: number;
        };
        language_def: number;
    };
    HiddenPoker: {
        name: string;
        prov_code: string;
        cp_key: number;
        pid: string;
        key: string;
        url: string;
        call_url: string;
        game_type: string;
    };
    BG: {
        name: string;
        cp_key: number;
        pid: string;
        key: string;
        url: string;
        img_url: string;
        call_url: string;
        req_call_timeout: number;
        game_type: string;
        agent_id: string;
        agent_pwd: string;
        trans_stored: {
            ttl: {
                round: number;
                bet_trans: number;
                result_trans: number;
                tip_trans: number;
            };
        };
        language: {
            ko: string;
            en: string;
            jp: string;
        };
        language_def: string;
        child_server_ip: string[];
    };
    HRG: {
        name: string;
        cp_key: number;
        pid: string;
        key: string;
        url: string;
        img_url: string;
        call_url: string;
        req_call_timeout: number;
        game_type: string;
        agent_id: string;
        trans_stored: {
            ttl: {
                round: number;
                bet_trans: number;
                result_trans: number;
                tip_trans: number;
            };
        };
        language: {
            ko: string;
            en: string;
            jp: string;
        };
        language_def: string;
        child_server_ip: string[];
        result_code: {
            SUCCESS: string;
            BET_FAIL: string;
            FAIL: string;
        };
        bet_limit: {
            A: string;
            B: string;
            C: string;
            D: string;
            E: string;
            F: string;
            G: string;
            H: string;
            I: string;
            J: string;
            K: string;
            L: string;
            M: string;
            N: string;
            O: string;
        };
    };
    SC: {
        name: string;
        cp_key: number;
        key: string;
        url: string;
        img_url: string;
        call_url: string;
        req_call_timeout: number;
        game_type: string;
        trans_stored: {
            ttl: {
                round: number;
                bet_trans: number;
                result_trans: number;
                tip_trans: number;
            };
        };
        language: {
            ko: string;
            en: string;
            jp: string;
        };
        language_def: string;
        child_server_ip: string[];
        result_code: {
            SUCCESS: number;
            FAIL: number;
        };
        result_err_msg: {
            NOT_ENOUGH: string;
            ERROR: string;
            MEMBER: string;
        };
    };
    Oddin: {
        name: string;
        cp_key: number;
        key: string;
        url: string;
        url_script: string;
        call_url: string;
        out_url: string;
        language: {
            ko: string;
            en: string;
        };
        language_def: string;
    };
    SB: {
        name: string;
        cp_key: number;
        key: string;
        op_key: string;
        prefix: string;
        url: string;
        img_url: string;
        call_url: string;
        req_call_timeout: number;
        game_code: string;
        game_type: string;
        game_type_mini: string;
        trans_stored: {
            ttl: {
                round: number;
                bet_trans: number;
                result_trans: number;
                tip_trans: number;
            };
        };
        language: {
            ko: string;
            en: string;
            jp: string;
        };
        language_def: string;
        child_server_ip: string[];
        result_code: {
            UNDEFINED: number;
            SUCCESS: number;
            DULICATE_TRANSACTION: number;
            PARAMS_ERROR: number;
            ACOUNT_CLOSED: number;
            ACOUNT_LOCKED: number;
            ACOUNT_IS_NOT_EXIST: number;
            ACOUNT_SUSPENDED: number;
            ACOUNT_EXISTED: number;
            MERCHANT_ID_IS_NOT_EXIST: number;
            INVALID_CURRENCY: number;
            INVALID_USER_ID: number;
            LANG_IS_NOT_SUPPORT: number;
            INVALID_TOKEN: number;
            INVALID_TIMEZONE: number;
            INVALID_AMOUNT: number;
            INVALID_DATETIME_FORMAT: number;
            INVALID_TRANS_STATUS: number;
            INVALID_BET_LIMIT_SETTING: number;
            INVALID_AUTH_KEY: number;
            INVALID_IP: number;
            PERMISSION_DENIED: number;
            PLAYER_HAS_INSUFFICIENT_FUND: number;
            IP_RESTRICED: number;
            NO_SUCH_TICKET: number;
            NO_DATA: number;
            UNABLE_TO_PROCESS: number;
            BET_NOT_ELIGIBLE: number;
            PLACEBET_CANNOT_BE_RETRIED: number;
            DATABASE_ERROR: number;
            NETWORK_ERROR: number;
            MAINTENANCE: number;
            REQUEST_TIMEOUT: number;
            SYSTEM_BUSY: number;
            SYSTEM_ERROR: number;
        };
        time_zone: number;
        odds_type: number;
        currency_type: number;
        max_bet_limit: number;
        min_bet_limit: number;
        platform: {
            PC: number;
            MOBILE: number;
        };
        log_path: string;
        job_path: string;
    };
    SA: {
        name: string;
        cp_key: number;
        encryption_key: string;
        md5_key: string;
        secret_key: string;
        lobby_code: string;
        prefix: string;
        url: string;
        game_url: string;
        img_url: string;
        call_url: string;
        req_call_timeout: number;
        game_type: string;
        trans_stored: {
            ttl: {
                round: number;
                bet_trans: number;
                result_trans: number;
                tip_trans: number;
            };
        };
        language: {
            ko: string;
            en: string;
            jp: string;
        };
        language_def: string;
        currency_type: string[];
        child_server_ip: string[];
        result_code: {
            SUCCESS: number;
            USER_ACCOUNT_DOESNT_EXIST: number;
            INVALID_CURRENCY: number;
            INVALID_AMOUNT: number;
            LOCKED_ACCOUNT: number;
            INSUFFICIENT_BALANCE: number;
            GENERAL_ERROR: number;
            DECRYPTION_ERROR: number;
            SESSION_EXPIRED_ERROR: number;
            SYSTEM_ERROR: number;
        };
    };
    CLP: {
        name: string;
        cp_key: number;
        key: string;
        agent_code: string;
        prefix: string;
        url: string;
        img_url: string;
        call_url: string;
        req_call_timeout: number;
        game_type: string;
        language: {
            ko: string;
            en: string;
            jp: string;
        };
        language_def: string;
        currency_type: string[];
        child_server_ip: string[];
        result_code: {
            fail: number;
            success: number;
            params_error: number;
            invalid_user_id: number;
            session_error: number;
        };
        platform: {
            pc: string;
            mobile: string;
        };
        log_path: string;
        job_path: string;
    };
};
export declare const Config: {
    EVOLUTION_GROUP: {
        name: string;
        cp_key: number;
        key: string;
        api_token: string;
        lobby_token: string;
        url: string;
        call_url: string;
        vendors: {
            1: {
                name: string;
                prov_code: string;
                cp_key: number;
                key: string;
                api_token: string;
                lobby_token: string;
                history_token: string;
                use_trans_log: boolean;
                game_type: string;
                url: string;
                bet_limit: {
                    A: string;
                    B: string;
                    C: string;
                };
                bet_limit_def: string;
                language_def: string;
                trans_stored: {
                    ROUND: number;
                    BET_TRANS: number;
                    RESULT_TRANS: number;
                    TIP_TRANS: number;
                };
                req_call_timeout: number;
                degit: number;
            };
            20: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            22: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            42: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            56: {
                name: string;
                prov_code: string;
                cp_key: number;
                game_type: string;
                language_def: string;
            };
        };
        vendorsId: {
            netent: {
                name: string;
                cp_key: number;
                game_type: string;
            };
        };
    };
    BNG_GROUP: {
        name: string;
        cp_key: number;
        pid: string;
        key: string;
        brand: string;
        url: string;
        url_lobby: string;
        lobby_gamecode: string;
        call_url: string;
        vendors: {
            "1": {
                name: string;
                cp_key: number;
                url: string;
                img_url: string;
                call_url: string;
                studio: string;
                game_type: string;
                wallet: string;
                req_call_timeout: number;
                trans_stored: {
                    round: number;
                    bet_trans: number;
                    result_trans: number;
                    tip_trans: number;
                };
                language: {
                    KO: string;
                    EN: string;
                };
                language_def: string;
                bet_limit: {
                    A: string;
                    B: string;
                    C: string;
                };
                bet_limit_def: string;
                degit: number;
            };
            "2": {
                name: string;
                cp_key: number;
                req_call_timeout: number;
            };
        };
    };
    MGP_GROUP: {
        name: string;
        cp_key: number;
        pid: string;
        key: string;
        key_scret: string;
        url: string;
        token_url: string;
        call_url: string;
        vendors: {
            LIVEDEALER: {
                name: string;
                prov_code: string;
                cp_key: number;
                game_type: string;
            };
            LIVEDEALERGRAND: {
                name: string;
                prov_code: string;
                cp_key: number;
                game_type: string;
            };
            MGLGRANDLIVEDEALER: {
                name: string;
                prov_code: string;
                cp_key: number;
                game_type: string;
            };
            MICROGAMINGLIVE: {
                name: string;
                prov_code: string;
                cp_key: number;
                game_type: string;
            };
            SLOTS: {
                name: string;
                prov_code: string;
                cp_key: number;
                game_type: string;
                lobby_gamecode: string;
            };
        };
    };
    MOA_GROUP: {
        name: string;
        cp_key: number;
        pid: string;
        key: string;
        passkey: string;
        url: string;
        call_url: string;
        vendors_id: {
            PNG: {
                NAME: string;
                cp_key: number;
                game_type: string;
            };
            EVP: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            BNG: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            WAZ: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            RLX: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            TPG: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            GA: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            BPG: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            TK: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            NLC: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            MOB: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            PP: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            DS: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            BTV: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            SWL: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            "1x2": {
                name: string;
                cp_key: number;
                game_type: string;
            };
            ELK: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            VGL: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            SWC: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            OPY: {
                name: string;
                cp_key: number;
                game_type: string;
            };
        };
    };
    GAMECODE: {
        NONE: string;
        SLOT: string;
        LIVE: string;
        SPOOR: string;
        BORD: string;
    };
    DC_GROUP: {
        cp_key: number;
        name: string;
        pid: string;
        key: string;
        url: string;
        history_url: string;
        call_url: string;
        id_length: number;
        vendors_id: {
            evo: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            yg: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            png: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            relax: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            aux: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            hs: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            op: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            nm: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            bg: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            bp: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            tk: {
                name: string;
                cp_key: number;
                game_type: string;
            };
        };
        vendors: {
            3: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            6: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            26: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            27: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            58: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            59: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            77: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            79: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            80: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            40: {
                name: string;
                cp_key: number;
                game_type: string;
            };
            41: {
                name: string;
                cp_key: number;
                game_type: string;
            };
        };
    };
    PLAYTECH_GROUP: {
        name: string;
        cp_key: number;
        pid: string;
        key: string;
        prefix: string;
        url: string;
        launcher_url: string;
        call_url: string;
        vendors: {};
    };
    AWC_GROUP: {
        NAME: string;
        cp_key: number;
        pid: string;
        key: string;
        url: string;
        call_url: string;
        time_zone: number;
        language: {
            ko: string;
            en: string;
        };
        LANGUAGE_DEF: string;
        VENDORS: {
            68: {
                name: string;
                cp_key: number;
                game_type: string;
                digit: number;
                bet_limit: {
                    A: string;
                    B: string;
                    C: string;
                    D: string;
                    E: string;
                    F: string;
                };
                bet_limit_def: string;
                trans_stored: {
                    ttl: {
                        round: number;
                        bet_trans: number;
                        result_trans: number;
                        tip_trans: number;
                    };
                };
            };
        };
    };
    JDB_GROUP: {
        name: string;
        cp_key: number;
        pid: string;
        dc: string;
        iv: string;
        key: string;
        prefix: string;
        url: string;
        call_url: string;
        language: {
            ko: string;
            en: string;
            jp: string;
        };
        language_def: string;
        vendors: {
            69: {
                ID: number;
                CP: {
                    name: string;
                    prov_code: string;
                    cp_key: number;
                    game_type: string;
                    paymode: string;
                };
            };
            72: {
                ID: number;
                CP: {
                    name: string;
                    prov_code: string;
                    cp_key: number;
                    game_type: string;
                    paymode: string;
                    bet_limit: {
                        A: string;
                        B: string;
                        C: string;
                        D: string;
                        E: string;
                    };
                    bet_limit_def: string;
                };
            };
        };
        vendors_id: {
            0: {
                name: string;
                prov_code: string;
                cp_key: number;
                game_type: string;
                paymode: string;
            };
            41: {
                name: string;
                prov_code: string;
                cp_key: number;
                game_type: string;
                paymode: string;
                bet_limit: {
                    A: string;
                    B: string;
                    C: string;
                    D: string;
                    E: string;
                };
                bet_limit_def: string;
            };
        };
    };
    BET_EVENT_TYPE: {
        NORMAL: number;
        EVENT_SPIN: number;
        FREE_SPIN: number;
        BONUS_SPIN: number;
        JACKPOT: number;
        CANCEL_RESULT: number;
        EVENT_CASH: number;
        EVENT_TOURNAMENT: number;
        EVENT_TIP: number;
        EVENT_CANCEL_TIP: number;
        RESERVE: number;
        DEBIT_RESERVE: number;
        COMMIT_RESERVE: number;
        CANCEL_RESERVE: number;
        RESULT_DEBIT: number;
        ADJUSTMENT_DEC: number;
        ADJUSTMENT_ADD: number;
        CASHWITHDRAW: number;
        CASHDEPOSIT: number;
        RESULT: {
            CORRECTION: number;
            CHNAGE_WIN: number;
            CHNAGE_LOST: number;
            CORRECTION_ADD: number;
            CORRECTION_DEC: number;
            BET_PARTITIAL_REFUND: number;
        };
    };
    bng_force_gamecode: {
        "299": {
            to_provider_id: string;
        };
        "371": {
            to_provider_id: string;
        };
        "378": {
            to_provider_id: string;
        };
        "380": {
            to_provider_id: string;
        };
        "279": {
            to_provider_id: string;
        };
        "361": {
            to_provider_id: string;
        };
        "176": {
            to_provider_id: string;
        };
        "352": {
            to_provider_id: string;
        };
        "294": {
            to_provider_id: string;
        };
        "69": {
            to_provider_id: string;
        };
        "373": {
            to_provider_id: string;
        };
        "311": {
            to_provider_id: string;
        };
        "205": {
            to_provider_id: string;
        };
        "282": {
            to_provider_id: string;
        };
        "264": {
            to_provider_id: string;
        };
    };
    APP_ENV: string;
    PROD: boolean;
    DEBUG: boolean;
    VER_MIN: number;
    VER_MAX: number;
    VER_DEFAULT: number;
    MAX_OPERATOR_KEY_CODE_LENGTH: number;
    MAX_OPERATOR_KEY_ADD_VALUE: number;
    ENC_KEY: string;
    ENC_IV_LENGTH: number;
    UNKNOWN_VALUE: number;
    TIME_ZONE: number;
    TIME_MS_OF_DAY: number;
    TIME_MS_OF_HOUR: number;
    TIME_MS_OF_MINUTE: number;
    RESPONSE_ERROR: string;
    MAX_GAMECODE_LENGTH: number;
    MAIN_APP_IP: string[];
    MANAGER_IP: string[];
    PRODUCT_NAME: string;
    MAIN_DOMAIN: string;
    MAIN_SERVER_URL: string;
    PLAY_API_URL: string;
    IMAGE_SERVER_URL: string;
    TRANSFER_SERVER_URL: string;
    LOG_VIEW_SERVER_URL_SET: string;
    LOG_VIEW_SERVER_URL_GET: string;
    MAX_UUID_SIZE: number;
    MAX_USER_KEY_SIZE: number;
    MAX_USER_ID_PREFIX_LEN: number;
    MAX_USER_ID_BODY_LEN: number;
    MAX_CUSTOMER_VALUE_LEN: number;
    DB_TIMECHECK_MS: number;
    CALLBACK_TIMECHECK_MS: number;
    MAX_TRANSFER_USER_DISPERSE_SIZE: number;
    OPERATOR_KEEP_MS: number;
    SEC_DAY: number;
    CALLBACK_REQUEST_TIMEOUT: number;
    BET_LIMIT_DEF: string;
    LANGUAGE_DEF: string;
    COUNTRY_NO: number;
    COUNTRY_A2: string;
    COUNTRY_A3: string;
    GAME_USE_LIST_RELOAD_TIME: number;
    SPLASH_USE: boolean;
    SPLASH_DEF_NAME: string;
    SPLASH_PLAY_API_URL: string;
    PUBLIC_URL_EXIT: string;
    SP_SERVER_URL: {
        GAMECODE: string;
    };
    SERVICE_LOG_SERVER: {
        URL: string;
        type: {
            api_app_play: number;
            api_play_play: number;
            cp_req_svc: number;
            svc_req_op_res: number;
            r_log: number;
            svc_res_cp: number;
        };
    };
    WALLET_TYPE: {
        SEAMLESS: string;
        TRANSFER: string;
    };
    CURRENCY: {
        DEF: string;
        KOR: string;
        EUR: string;
        JPN: string;
    };
    REDIS: {
        HOST: string;
        PORT: number;
        PASSWORD: string;
        DB: number;
        TIMECHECK_MS: number;
        SESSION_USE: boolean;
        BALANCE_USE: boolean;
        BALANCE_KEEP_SEC: number;
        GAMELOG_USE: boolean;
        GAMELOG_KEEP_SEC: number;
        LIVE_ROUND_LOG_USE: boolean;
        LIVE_ROUND_LOG_KEEP_SEC: number;
        ROUND_CHECK_USE: boolean;
        ROUND_CHECK_KEEP_SEC: number;
        AUTHTOKEN_KEEP_USE: boolean;
        AUTHTOKEN_KEEP_SEC: number;
        IO_LOG_USE: boolean;
        IO_LOG_TTL_SEC: number;
        TRANSDATA_USE: boolean;
        TRANSDATA_KEEP_SEC: number;
        TRANSDATA_KEEP_SEC_MIN: number;
        TRANS_LOG_TOKEN_KEEP_SEC: number;
        TRANS_LOG_USE: boolean;
        GAME_USE_LIST_USE: boolean;
        GAME_USE_LIST_USE_KEEP_SEC: number;
    };
    GRPC_SERVER_HOST: string;
    CA_CERT_PEM: string;
    CONFIG_NAME: string;
    VPN_IP: string;
    TABLE_LIST_WHITE_LIST: {
        "/game/tablelist/": string[];
        "/log/get/": string[];
        "/log/ticket/get": string[];
        "/transfer/balance/": string[];
        "/transfer/balance/all/": never[];
        "/transfer/op_balance/": never[];
        "/transfer/in/": string[];
        "/transfer/out/": string[];
        "/transfer/betlimit/": never[];
        "/cp_transfer/status/list/": string[];
    };
    GRPC_RES_STATUS_MAP: {
        PROVIDER: {
            EVO: string;
            BNG: string;
            PP: string;
            FASTSPIN: string;
        };
        EVOLUTION: {
            0: string;
            1: string;
            100: string;
            10000: string;
            10001: string;
            10002: string;
            101: string;
            102: string;
            20000: string;
            20001: string;
            201: string;
            20100: string;
            20101: string;
            20102: string;
            20110: string;
            20111: string;
            20200: string;
            20201: string;
            20202: string;
            20203: string;
            20204: string;
            20205: string;
            20206: string;
            20207: string;
            21000: string;
            21001: string;
            21003: string;
            21004: string;
            21009: string;
            21010: string;
            21011: string;
            21012: string;
            4001: string;
            4002: string;
            4003: string;
            4010: string;
            4101: string;
            4102: string;
            4103: string;
            4104: string;
            5001: string;
            6001: string;
            6002: string;
            6003: string;
            6101: string;
            999: string;
            10: string;
            20: string;
            90: string;
            99: string;
            900001: string;
            900002: string;
            900003: string;
        };
        BNG: {
            0: string;
            1: string;
            100: string;
            10000: string;
            10001: string;
            10002: string;
            101: string;
            102: string;
            20000: string;
            20001: string;
            201: string;
            20100: string;
            20101: string;
            20102: string;
            20110: string;
            20111: string;
            20200: string;
            20201: string;
            20202: string;
            20203: string;
            20204: string;
            20205: string;
            20206: string;
            20207: string;
            21000: string;
            21001: string;
            21003: string;
            21004: string;
            21009: string;
            21010: string;
            21011: string;
            21012: string;
            4001: string;
            4002: string;
            4003: string;
            4010: string;
            4101: string;
            4102: string;
            4103: string;
            4104: string;
            5001: string;
            6001: string;
            6002: string;
            6003: string;
            6101: string;
            999: string;
            10: string;
            20: string;
            90: string;
            99: string;
            900001: string;
            900002: string;
            900003: string;
        };
        PP: {};
        FASTSPIN: {
            0: string;
            1: string;
            100: string;
            10000: string;
            10001: string;
            10002: string;
            101: string;
            102: string;
            20000: string;
            20001: string;
            201: string;
            20100: string;
            20101: string;
            20102: string;
            20110: string;
            20111: string;
            20200: string;
            20201: string;
            20202: string;
            20203: string;
            20204: string;
            20205: string;
            20206: string;
            20207: string;
            21000: string;
            21001: string;
            21003: string;
            21004: string;
            21009: string;
            21010: string;
            21011: string;
            21012: string;
            4001: string;
            4002: string;
            4003: string;
            4010: string;
            4101: string;
            4102: string;
            4103: string;
            4104: string;
            5001: string;
            6001: string;
            6002: string;
            6003: string;
            6101: string;
            999: string;
            10: string;
            20: string;
            90: string;
            99: string;
            900001: string;
            900002: string;
            900003: string;
        };
    };
    DEVICE: {
        pc: string;
        mobile: string;
    };
    EVOLUTION_DEBIT_CHECK_PREFIX: string;
    EVOLUTION_DEBIT_CHECK_INIT: {
        isEnd: boolean;
        changeBy: string;
    };
    EVOLUTION_PRE_CANCEL_PREFIX: string;
    FASTSPIN_DEBIT_TRANSFER_PREFIX: string;
    FASTSPIN_DEBIT_REFERENCE_PREFIX: string;
};
export declare const MysqlConfig: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    waitForConnections: boolean;
    connectionLimit: number;
    queueLimit: number;
};
