plugins {
    id("java")
    id("org.jetbrains.kotlin.jvm") version "1.9.22"
    id("org.jetbrains.intellij") version "1.17.2"
}

group = "systems.heady"
version = "0.1.0"

repositories {
    mavenCentral()
}

intellij {
    version.set("2024.1")
    type.set("IC") // IntelliJ IDEA Community — compatible with all JetBrains IDEs
    plugins.set(listOf("com.intellij.java"))
}

dependencies {
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.google.code.gson:gson:2.10.1")
    implementation("org.java-websocket:Java-WebSocket:1.5.6")
    testImplementation("junit:junit:4.13.2")
}

tasks {
    patchPluginXml {
        sinceBuild.set("241")
        untilBuild.set("252.*")
        pluginDescription.set("""
            <h2>Heady Dev Companion for JetBrains</h2>
            <p>AI code assistant with completions, chat, refactors, agents, and voice input.</p>
            <ul>
                <li>Inline code completions</li>
                <li>Chat panel with codebase awareness</li>
                <li>Explain, refactor, test generation</li>
                <li>Multi-step agent mode</li>
                <li>Local, hybrid, or cloud AI</li>
            </ul>
            <p><em>HeadySystems — Sacred Geometry Architecture</em></p>
        """.trimIndent())
    }
    buildSearchableOptions { enabled = false }
}
