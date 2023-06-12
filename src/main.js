const relay = require("./actions/relay.js");
const logger = require("./utils/logger.js");
const event = require("./actions/event.js");

const BOT_PRIVATE_KEY_HEX =
    "**** 秘密～鍵は～しまっておけよ～♪ by Nostrのうた *****";

/**
 * @summary 購読時のコールバック
 */
const callback = (ev) => {
    logger.debug("[" + ev.created_at + "] content: " + ev.content);
    if (ev.content.match(/(ほめ|褒め|たたえ|称え)(て|ろ)/g)) {
        logger.debug("Hit!");
        const reaction = event.create("reaction", "+", ev);
        relay.publish(reaction);
        const post = event.create("reply", "えらい！", ev);
        relay.publish(post);
    }
};

/**
 * @summary メイン処理
 */
const main = async () => {
    // 接続するリレーサーバのURL
    const relayUrl = "wss://relay-jp.nostr.wirednet.jp";

    // リレー初期化
    if (!relay.init(relayUrl, BOT_PRIVATE_KEY_HEX)) {
        return;
    }

    // リレー接続
    await relay.connect();

    // イベントに秘密鍵を設定
    event.init(BOT_PRIVATE_KEY_HEX);

    // 起動メッセージ投稿
    // const post = event.create("post", "起動したよ");
    // relay.publish(post);

    // 購読処理
    relay.subscribe(callback);
};

/**
 * @summary エントリポイント
 */
main().catch((e) => logger.error(e));
