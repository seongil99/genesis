<script lang="ts">
	let { form } = $props();
</script>

<svelte:head>
	<title>A little surprise is waiting…</title>
	<meta name="description" content="A private birthday surprise, made with a whole lot of love." />
</svelte:head>

<main class="login-page">
	<div class="login-orb login-orb--one"></div>
	<div class="login-orb login-orb--two"></div>

	<section class="login-card" aria-labelledby="login-title">
		<div class="gift-mark" aria-hidden="true">
			<span class="gift-mark__bow gift-mark__bow--left"></span>
			<span class="gift-mark__bow gift-mark__bow--right"></span>
			<span class="gift-mark__box">✦</span>
		</div>

		<p class="eyebrow">A little something for you</p>
		<h1 id="login-title">There’s a surprise inside.</h1>
		<p class="login-copy">Enter the secret password to unwrap it.</p>

		<form method="POST" class="password-form">
			<label for="password">Secret password</label>
			<div class="input-wrap">
				<input
					id="password"
					name="password"
					type="password"
					autocomplete="current-password"
					placeholder="Type it here…"
					required
					aria-describedby={form?.incorrect ? 'password-error' : undefined}
					aria-invalid={form?.incorrect ? 'true' : undefined}
				/>
				<span aria-hidden="true">✦</span>
			</div>

			{#if form?.incorrect}
				<p class="form-error" id="password-error">
					That’s not quite it. Here’s a hint: make a wish!
				</p>
			{/if}

			<button type="submit">
				<span>Open your surprise</span>
				<span aria-hidden="true">→</span>
			</button>
		</form>

		<p class="login-note"><span aria-hidden="true">♥</span> Made just for someone wonderful</p>
	</section>
</main>
