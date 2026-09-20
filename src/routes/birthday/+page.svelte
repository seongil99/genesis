<script lang="ts">
	let candlesOut = $state(false);
	let wishRevealed = $state(false);

	const confetti = Array.from({ length: 32 }, (_, index) => ({
		left: `${(index * 37) % 100}%`,
		delay: `${(index % 8) * -0.45}s`,
		duration: `${3.8 + (index % 5) * 0.35}s`,
		color: ['coral', 'gold', 'pink', 'blue'][index % 4]
	}));
</script>

<svelte:head>
	<title>Happy Birthday!</title>
	<meta name="description" content="A joyful birthday celebration for a truly wonderful person." />
</svelte:head>

<main class="birthday-page" class:candles-out={candlesOut}>
	<div class="confetti-field" aria-hidden="true">
		{#each confetti as piece, index (index)}
			<i
				class:confetti-coral={piece.color === 'coral'}
				class:confetti-gold={piece.color === 'gold'}
				class:confetti-pink={piece.color === 'pink'}
				class:confetti-blue={piece.color === 'blue'}
				style:--left={piece.left}
				style:--delay={piece.delay}
				style:--duration={piece.duration}
			></i>
		{/each}
	</div>

	<form method="POST" action="?/logout" class="logout-form">
		<button type="submit" aria-label="Lock this birthday surprise">
			<span aria-hidden="true">⌁</span> Lock
		</button>
	</form>

	<section class="celebration" aria-labelledby="birthday-title">
		<p class="birthday-kicker"><span></span> Today is all about you <span></span></p>
		<h1 id="birthday-title">
			Happy
			<strong>Birthday!</strong>
		</h1>
		<p class="birthday-message">
			Here’s to another trip around the sun — and to all the joy, laughter, and beautiful moments
			waiting for you.
		</p>

		<div class="cake-scene" aria-label="A birthday cake with three lit candles">
			<div class="spark spark--one" aria-hidden="true">✦</div>
			<div class="spark spark--two" aria-hidden="true">✦</div>
			<div class="cake">
				<div class="candles" aria-hidden="true">
					<div class="candle candle--one"><i></i></div>
					<div class="candle candle--two"><i></i></div>
					<div class="candle candle--three"><i></i></div>
				</div>
				<div class="cake-top">
					<div class="icing-drop icing-drop--one"></div>
					<div class="icing-drop icing-drop--two"></div>
					<div class="icing-drop icing-drop--three"></div>
				</div>
				<div class="cake-body">
					<span>♥</span><span>✦</span><span>♥</span><span>✦</span><span>♥</span>
				</div>
				<div class="cake-plate"></div>
			</div>
		</div>

		<div class="celebration-actions">
			<button class="wish-button" type="button" onclick={() => (candlesOut = !candlesOut)}>
				<span aria-hidden="true">{candlesOut ? '✦' : '☁'}</span>
				{candlesOut ? 'Light them again' : 'Make a wish & blow!'}
			</button>
			<button class="note-button" type="button" onclick={() => (wishRevealed = !wishRevealed)}>
				{wishRevealed ? 'Hide my note' : 'A note for you'}
				<span aria-hidden="true">♥</span>
			</button>
		</div>

		{#if candlesOut}
			<p class="wish-made" role="status">Your wish is on its way ✨</p>
		{/if}

		<div class="birthday-note" class:birthday-note--open={wishRevealed}>
			<p>
				May this year bring you more reasons to smile, brave new adventures, and the kind of
				happiness that stays with you. You deserve every wonderful thing.
			</p>
			<span>With all my love ♥</span>
		</div>
	</section>

	<footer>Made with <span aria-hidden="true">♥</span> for your special day</footer>
</main>
