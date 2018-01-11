/*
function separate_text_and_make_spans( $text ) {
	$pair = ['S*' => 1, '*E' => 1, 'II' => 1, 'KK' => 1, 'HH' => 1, 'HI' => 1];
	$t_prev = '';
	$word = '';
	$parts = [];

	for ( $i = 0, $I = mb_strlen( $text ); $i < $I; $i += 1 ) {
		$c = mb_substr( $text, $i, 1 );
		$t = _get_ctype( $c );
		if ( isset( $pair[ $t_prev . $t ] ) || isset( $pair[ '*' . $t ] ) || isset( $pair[ $t_prev . '*' ] ) ) {
			$word .= $c;
		} else if ( $t === 'O' ) {
			if ( $t_prev === 'O' ) {
				$word .= $c;
			} else {
				if ( ! empty( $word ) ) $parts[] = [$word, 1];
				$word = $c;
			}
		} else {
			if ( ! empty( $word ) ) $parts[] = [$word, ( $t_prev === 'O' ) ? 0 : 1];
			$word = $c;
		}
		$t_prev = $t;
	}
	if ( ! empty( $word )) $parts[] = [$word, ( $t_prev === 'O' ) ? 0 : 1];

	$ret = '';
	foreach ( $parts as $ws ) {
		$ret .= ($ws[1] === 1) ? ('<span>' . esc_html( $ws[0] ) . '</span>') : esc_html( $ws[0] );
	}
	return $ret;
}

function _get_ctype( $c ) {
	$pats = [
		'[「『（［｛〈《【〔]' => 'S',
		'[」』）］｝〉》】〕、，。．？]' => 'E',
		'[ぁ-ん]' => 'I',
		'[ァ-ヴーｱ-ﾝﾞｰ]' => 'K',
		'[一-龠々〆ヵヶ]' => 'H',
	];
	foreach ( $pats as $p => $t ) {
		if ( preg_match( "/" . $p . "/u", $c ) === 1 ) return $t;
	}
	return 'O';
}

 */
