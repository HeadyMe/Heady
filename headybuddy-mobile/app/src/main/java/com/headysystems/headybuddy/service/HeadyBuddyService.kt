package com.headysystems.headybuddy.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.headysystems.headybuddy.R
import com.headysystems.headybuddy.ui.ChatActivity

/**
 * HeadyBuddy Always-On Foreground Service
 *
 * Keeps HeadyBuddy running persistently on Android with:
 * - Persistent notification with quick actions
 * - Connection to heady-manager API
 * - Context awareness (clipboard, app switches)
 *
 * Must call startForeground() within 5 seconds of service start.
 */
class HeadyBuddyService : Service() {

    companion object {
        const val CHANNEL_ID = "heady_buddy_channel"
        const val NOTIFICATION_ID = 1001
        const val ACTION_ASK = "com.headysystems.headybuddy.ACTION_ASK"
        const val ACTION_SUMMARIZE = "com.headysystems.headybuddy.ACTION_SUMMARIZE"
        const val ACTION_STOP = "com.headysystems.headybuddy.ACTION_STOP"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_STOP -> {
                stopForeground(STOP_FOREGROUND_REMOVE)
                stopSelf()
                return START_NOT_STICKY
            }
            ACTION_ASK -> {
                // Launch chat activity
                val chatIntent = Intent(this, ChatActivity::class.java).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    putExtra("action", "ask")
                }
                startActivity(chatIntent)
            }
            ACTION_SUMMARIZE -> {
                // Get clipboard and summarize
                val chatIntent = Intent(this, ChatActivity::class.java).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    putExtra("action", "summarize_clipboard")
                }
                startActivity(chatIntent)
            }
        }

        val notification = buildNotification()
        startForeground(NOTIFICATION_ID, notification)

        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        // Service destroyed — will be restarted by START_STICKY or BootReceiver
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "HeadyBuddy Service",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Keeps HeadyBuddy running for always-on AI assistance"
                setShowBadge(false)
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(): Notification {
        // Tap notification → open chat
        val chatPendingIntent = PendingIntent.getActivity(
            this, 0,
            Intent(this, ChatActivity::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // "Ask Heady" quick action
        val askPendingIntent = PendingIntent.getService(
            this, 1,
            Intent(this, HeadyBuddyService::class.java).apply { action = ACTION_ASK },
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // "Summarize Clipboard" quick action
        val summarizePendingIntent = PendingIntent.getService(
            this, 2,
            Intent(this, HeadyBuddyService::class.java).apply { action = ACTION_SUMMARIZE },
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // "Stop" action
        val stopPendingIntent = PendingIntent.getService(
            this, 3,
            Intent(this, HeadyBuddyService::class.java).apply { action = ACTION_STOP },
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("HeadyBuddy")
            .setContentText("Your AI companion is ready")
            .setSmallIcon(R.drawable.ic_heady_notification)
            .setContentIntent(chatPendingIntent)
            .setOngoing(true)
            .setSilent(true)
            .addAction(R.drawable.ic_ask, "Ask Heady", askPendingIntent)
            .addAction(R.drawable.ic_summarize, "Summarize", summarizePendingIntent)
            .addAction(R.drawable.ic_stop, "Stop", stopPendingIntent)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }
}
