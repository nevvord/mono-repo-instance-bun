<script lang="ts">
	import {} from '@melt-ui/svelte';
	// Simple page without Melt UI for now
</script>

<svelte:head>
	<title>Mono Repo - Web UI</title>
</svelte:head>

<main class="container">
	<header class="header">
		<h1>🚀 Mono Repo Web UI</h1>
		<p>Современный веб-интерфейс с Svelte и Melt UI</p>
	</header>

	<div class="grid">
		<div class="card">
			<div class="card-header">
				<h3>Backend API</h3>
				<p>Статус подключения к backend серверу</p>
			</div>
			<div class="card-content">
				<div class="status">
					<span class="badge">Порт: 3000</span>
					<span class="badge">Окружение: development</span>
				</div>
			</div>
			<div class="card-footer">
				<button class="btn btn-outline"> Проверить API </button>
			</div>
		</div>

		<div class="card">
			<div class="card-header">
				<h3>Svelte 5 Компоненты</h3>
				<p>Демонстрация компонентов Svelte</p>
			</div>
			<div class="card-content">
				<div class="buttons">
					<button class="btn btn-primary"> Primary </button>
					<button class="btn btn-outline"> Outline </button>
					<button class="btn btn-ghost"> Ghost </button>
				</div>
			</div>
		</div>

		<div class="card">
			<div class="card-header">
				<h3>Технологии</h3>
				<p>Используемые технологии в проекте</p>
			</div>
			<div class="card-content">
				<div class="tech-stack">
					<span class="badge badge-secondary">Svelte 5</span>
					<span class="badge badge-secondary">Melt UI</span>
					<span class="badge badge-secondary">TypeScript</span>
					<span class="badge badge-secondary">Bun</span>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.header h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: #1f2937;
	}

	.header p {
		font-size: 1.125rem;
		color: #6b7280;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.card {
		border: 1px solid #e5e7eb;
		border-radius: 0.75rem;
		overflow: hidden;
		transition: all 0.2s ease;
		background: white;
	}

	.card:hover {
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	.card-header {
		padding: 1.5rem 1.5rem 0.5rem;
	}

	.card-header h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
		color: #1f2937;
	}

	.card-header p {
		font-size: 0.875rem;
		color: #6b7280;
		margin: 0;
	}

	.card-content {
		padding: 0 1.5rem 1rem;
	}

	.card-footer {
		padding: 0 1.5rem 1.5rem;
	}

	.status {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.buttons {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tech-stack {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 500;
		border-radius: 0.375rem;
		border: 1px solid #d1d5db;
		background: #f9fafb;
		color: #374151;
	}

	.badge-secondary {
		background: #f3f4f6;
		color: #6b7280;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: 0.375rem;
		border: 1px solid transparent;
		cursor: pointer;
		transition: all 0.2s ease;
		text-decoration: none;
	}

	.btn-primary {
		background: #3b82f6;
		color: white;
	}

	.btn-primary:hover {
		background: #2563eb;
	}

	.btn-outline {
		background: transparent;
		color: #374151;
		border-color: #d1d5db;
	}

	.btn-outline:hover {
		background: #f9fafb;
		border-color: #9ca3af;
	}

	.btn-ghost {
		background: transparent;
		color: #374151;
	}

	.btn-ghost:hover {
		background: #f3f4f6;
	}
</style>
