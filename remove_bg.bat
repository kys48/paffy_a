@echo off
SET IMG_PATH=%1
SET IMG_NAME=%2
SET TARGET_IMG_PATH=%3
SET TARGET_IMG_PATH_NAME=%TARGET_IMG_PATH%%IMG_NAME%
SET TARGET_IMG_TMP_PATH_NAME=%TARGET_IMG_PATH%tmp/%IMG_NAME%
SET THRESHOLD=%4

cp %IMG_PATH%%IMG_NAME% %TARGET_IMG_PATH%tmp/%IMG_NAME%

convert %TARGET_IMG_TMP_PATH_NAME% ( +clone -fx "p{0,0}" )  -compose Difference  -composite   -modulate 100,0  +matte  %TARGET_IMG_TMP_PATH_NAME%_difference.png

convert %TARGET_IMG_TMP_PATH_NAME%_difference.png -bordercolor white -border 1x1 -matte -fill none -fuzz 7%% -draw "matte 1,1 floodfill" -shave 1x1 %TARGET_IMG_TMP_PATH_NAME%_removed_black.png
composite  -compose Dst_Over -tile pattern:checkerboard %TARGET_IMG_TMP_PATH_NAME%_removed_black.png %TARGET_IMG_TMP_PATH_NAME%_removed_black_check.png

convert %TARGET_IMG_TMP_PATH_NAME%_removed_black.png -channel matte -separate  +matte %TARGET_IMG_TMP_PATH_NAME%_matte.png

convert %TARGET_IMG_TMP_PATH_NAME%_matte.png -negate -blur 0x1 %TARGET_IMG_TMP_PATH_NAME%_matte-negated.png

convert %TARGET_IMG_TMP_PATH_NAME%_matte.png -morphology Erode Diamond %TARGET_IMG_TMP_PATH_NAME%_erode_matte.png

composite -compose CopyOpacity %TARGET_IMG_TMP_PATH_NAME%_erode_matte.png %TARGET_IMG_TMP_PATH_NAME% %TARGET_IMG_TMP_PATH_NAME%_finished.png

convert %TARGET_IMG_TMP_PATH_NAME%_finished.png -bordercolor white -border 1x1 -matte -fill none -fuzz  %THRESHOLD%%% -draw "matte 1,1 floodfill" -shave 1x1 %TARGET_IMG_PATH_NAME%

convert %TARGET_IMG_PATH_NAME% -fuzz 2%% -transparent white %TARGET_IMG_PATH_NAME%

rm %TARGET_IMG_PATH%tmp/*
