package uz.tibbiyotted.journal;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Calendar;

public class ClassScheduleWidget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        final RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.class_schedule_widget);
        views.setTextViewText(R.id.appwidget_text, "Yuklanmoqda...");
        appWidgetManager.updateAppWidget(appWidgetId, views);

        // Ma'lumotlarni fonda yuklash uchun yangi oqim (Thread) ochamiz
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    // 1. Vercel saytidan dars ma'lumotlarini yuklaymiz
                    URL url = new URL("https://webjurnal.vercel.app/schedule/data.json");
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("GET");
                    conn.connect();

                    BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuilder sbJson = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        sbJson.append(line);
                    }
                    reader.close();

                    JSONObject root = new JSONObject(sbJson.toString());
                    JSONArray lessonsArray = root.getJSONArray("lessons");
                    JSONArray groupsArray = root.getJSONArray("groups");

                    // 2. Bugungi kunni aniqlaymiz (1: Dushanba, ..., 7: Yakshanba)
                    Calendar calendar = Calendar.getInstance();
                    int dayVal = calendar.get(Calendar.DAY_OF_WEEK) - 1;
                    if (dayVal == 0) dayVal = 7;

                    String[] dayNames = {"Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"};
                    String todayName = (dayVal >= 1 && dayVal <= 7) ? dayNames[dayVal - 1] : "Dushanba";

                    // 3. Guruh ID larini nomlariga moslaymiz
                    java.util.Map<Integer, String> groupMap = new java.util.HashMap<>();
                    for (int i = 0; i < groupsArray.length(); i++) {
                        JSONObject g = groupsArray.getJSONObject(i);
                        groupMap.put(g.getInt("id"), g.getString("name"));
                    }

                    // 4. Bugungi darslarni filtrlaymiz
                    java.util.List<String> todayLessons = new java.util.ArrayList<>();
                    for (int i = 0; i < lessonsArray.length(); i++) {
                        JSONObject l = lessonsArray.getJSONObject(i);
                        if (l.getInt("dayOfWeek") == dayVal) {
                            int period = l.getInt("period");
                            int groupId = l.getInt("groupId");
                            String groupName = groupMap.containsKey(groupId) ? groupMap.get(groupId) : "Noma'lum Guruh";

                            String[] romanNumerals = {"I", "II", "III", "IV", "V", "VI"};
                            String roman = (period >= 1 && period <= 6) ? romanNumerals[period - 1] : String.valueOf(period);

                            todayLessons.add(roman + "-para: " + groupName);
                        }
                    }

                    // 5. Matnni shakllantiramiz
                    StringBuilder sbText = new StringBuilder();
                    sbText.append("📅 ").append(todayName).append(" kungi darslar:\n");
                    sbText.append("-----------------------------\n");
                    if (todayLessons.isEmpty()) {
                        sbText.append("Bugun darslar yo'q. Hordiq oling!");
                    } else {
                        for (String s : todayLessons) {
                            sbText.append("• ").append(s).append("\n");
                        }
                    }

                    // 6. UI ekrandagi matnni yangilaymiz
                    views.setTextViewText(R.id.appwidget_text, sbText.toString());
                    appWidgetManager.updateAppWidget(appWidgetId, views);

                } catch (Exception e) {
                    e.printStackTrace();
                    views.setTextViewText(R.id.appwidget_text, "Darslarni yangilab bo'lmadi.\nTarmoqni tekshiring.");
                    appWidgetManager.updateAppWidget(appWidgetId, views);
                }
            }
        }).start();
    }
}
